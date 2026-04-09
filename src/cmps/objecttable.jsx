import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
} from '@table-library/react-table-library/table';
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

import { useContext, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { objectService } from '../services/objectservice';
import { AppContext } from "../AppContext"

export function ObjectTable({ data, objectType, objectProps, width = "50", setObjectData, extraObjectData }) {

    const theme = useTheme([getTheme(), {
        HeaderRow: `
        background-color: rgb(244, 244, 244);
      `,
        Row: `
        &:nth-of-type(odd) {
          background-color: rgb(255, 255, 255);
        }

        &:nth-of-type(even) {
          background-color: rgb(244, 244, 244);
        }
      `,
    }]);

    const [editingId, setEditingId] = useState(null)

    const [addInputs, setAddInputs] = useState({})
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showDelete, setShowDelete] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const handleCloseDelete = () => setShowDelete(false)
    const handleShowDelete = () => setShowDelete(true)

    const handleAddChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setAddInputs(values => ({ ...values, [name]: value }))
    }

    const { token } = useContext(AppContext)

    const handleAddNew = async () => {
        console.log(addInputs)
        if (Object.keys(addInputs).length < objectProps.columns.length) return
        for (const input of Object.values(addInputs)) {
            if (!input) return
        }
        if (editingId) await objectService.editObject(objectType, token, addInputs)
        else {
            await objectService.addObject(objectType, token, addInputs)
        }
        setObjectData(await objectService.getObjectList(objectType, token))
        setAddInputs({})
        handleClose()
    }

    const handleDelete = async () => {
        if (deletingId == null) return
        await objectService.deleteObject(objectType, token, deletingId)
        // setObjectData(await objectService.getObjectList(objectType, token)) // lazy approach
        setObjectData((prevData) => prevData.filter(object => object[objectProps.id] != deletingId))
        handleCloseDelete()
    }

    const showPdf = async (approvalId) => {
        const blob = await objectService.generatePdf(token, approvalId)
        const url = URL.createObjectURL(blob);
        window.open(url);
    }

    const startEditing = (id) => {
        setEditingId(id)
        var objects = data.nodes
        var editing = objects.find(object => object[objectProps.id] == id)
        console.log(editing)
        setAddInputs(editing)
        handleShow()
    }

    return (
        <>
            <div className="rtl">
                <div className={`rtl-table w-${width}`}>
                    <Table data={data} theme={theme} className="">
                        {(tableList) => (
                            <>
                                <Header>
                                    <HeaderRow>
                                        {objectProps.columns.map(column => {
                                            var value = column[1]
                                            return <HeaderCell>{value}</HeaderCell>
                                        })}
                                        <HeaderCell>פעולות</HeaderCell>
                                    </HeaderRow>
                                </Header>
                                <Body>
                                    {tableList.map((item, index) => (
                                        <Row key={item[objectProps.id]} item={item}>
                                            {objectProps.columns.map(column => {
                                                if (column.length == 2) {
                                                    var value = column[0]
                                                    return <Cell>{item[value]}</Cell>
                                                }
                                                else {
                                                    var objects = extraObjectData[column[2]]
                                                    var value = column[0]
                                                    return <Cell>{objects.find(object => object[value] == item[value]).name}</Cell>
                                                }
                                            })}
                                            <Cell>
                                                <button className="btn p-0" onClick={() => {
                                                    setDeletingId(item[objectProps.id])
                                                    handleShowDelete()
                                                }}>❌</button>
                                                <button className="btn p-0" onClick={() => [
                                                    startEditing(item[objectProps.id])
                                                ]}>✏️</button>
                                                {objectType != "approvals" ? <></> :
                                                    <button className="btn p-0" onClick={() => {
                                                        showPdf(item[objectProps.id])
                                                    }}>📄</button>
                                                }
                                            </Cell>
                                        </Row>
                                    ))}
                                </Body>
                            </>
                        )}
                    </Table>
                </div>
                <button className="btn btn-primary fs-6 m-2" onClick={() => {
                    handleShow()
                    setAddInputs({})
                    setEditingId(null)
                }}>➕ להוסיף חדש</button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="rtl">
                    <Modal.Title>{`הוספת ${objectProps.nameHebrew}`}</Modal.Title>
                    {/* <button type="button" className="btn-close" data-bs-dismiss="modal"></button> */}
                </Modal.Header>
                <Modal.Body>
                    {objectProps.columns.map(column => {
                        if (column[0] == "clerkId") {
                            return (
                                <></>
                            )
                        }
                        if (column.length == 2) {
                            return (
                                <div className="rtl mb-2">
                                    <label>{column[1]}</label>
                                    <input
                                        className="form-control"
                                        name={column[0]}
                                        onChange={handleAddChange}
                                        value={addInputs[column[0]]}
                                    />
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="rtl mb-2">
                                    <label>{column[1]}</label>
                                    <select
                                        className="form-control"
                                        name={column[0]}
                                        onChange={handleAddChange}
                                        value={addInputs[column[0]]}
                                    >
                                        <option value=""></option>
                                        {extraObjectData[column[2]].map(object => {
                                            return (
                                                <option value={object[column[0]]}>{object.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            )
                        }

                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddNew}>
                        הוספה
                    </Button>
                </Modal.Footer>
            </Modal>

            {deletingId == null ? <></> :
                <Modal show={showDelete} onHide={handleCloseDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>{`מחיקת ${objectProps.nameHebrew}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body dir="rtl">
                        {`למחוק את ה${objectProps.nameHebrew} ${data.nodes.find(object => object[objectProps.id] == deletingId)?.name}?`}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleDelete}>
                            למחוק
                        </Button>
                        <Button variant="secondary" onClick={handleCloseDelete}>
                            ביטול
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}