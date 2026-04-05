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

export function ApprovalTable({ data, objectType, objectProps, width = "100", setObjectData, extraObjectData }) {

    console.log(extraObjectData)

    const theme = useTheme(getTheme());

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
        await objectService.addObject(objectType, token, addInputs)
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

    return (
        <>
            <div className="rtl">
                <div className={`rtl-table w-${width}`}>
                    <Table data={data} theme={theme}>
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
                                                if (column[0] == "clerkId") {
                                                    var users = extraObjectData.users
                                                    console.log(users)
                                                    return <Cell>{users.find(user => user.userId == item.clerkId).fullName}</Cell>
                                                }
                                                else if (column[0] == "hospitalId") {
                                                    var hospitals = extraObjectData.hospitals
                                                    var hospitalId = extraObjectData.institutes.find(i => i.instituteId == item.instituteId).hospitalId
                                                    return <Cell>{hospitals.find(hospital => hospital.hospitalId == hospitalId).name}</Cell>
                                                }
                                                else if (column[0] == "approverId") {
                                                    var approvers = extraObjectData.approvers
                                                    return <Cell>{approvers.find(approver => approver.approverId == item.approverId).fullName}</Cell>
                                                }
                                                else if (column.length == 2) {
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
                                                <button className="btn p-0">✏️</button>
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
                <button className="btn fs-4 m-2" onClick={handleShow}>➕</button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{`הוספת ${objectProps.nameHebrew}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* approvalId, hospitalizationId */}
                    <div className="row">
                        <div className="rtl mb-2 col-6">
                            <label>מספר שובר </label>
                            <input className="form-control" disabled
                                name="approvalId" onChange={handleAddChange}
                                value={addInputs.approvalId}
                            />
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>מספר אשפוז</label>
                            <input className="form-control"
                                name="hospitalizationId" onChange={handleAddChange}
                                value={addInputs.hospitalizationId}
                            />
                        </div>
                    </div>
                    {/* testId, approvalDate */}
                    <div className="row">
                        <div className="rtl mb-2 col-6">
                            <label>תאריך</label>
                            <input type="date" className="form-control"
                                name="approvalDate" onChange={handleAddChange}
                                value={addInputs.approvalDate}
                            />
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>סוג בדיקה</label>
                            <select className="form-control"
                                name="testId" onChange={handleAddChange}
                            >
                                <option value=""></option>
                                {extraObjectData.tests.map(object => {
                                    return (
                                        <option value={object.testId}>{object.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    {/* idnumber firstname lastname */}
                    <div className="row">
                        <div className="rtl mb-2 col-4">
                            <label>תעודת זהות</label>
                            <input className="form-control"
                                name="idNumber" onChange={handleAddChange}
                                value={addInputs.idNumber}
                            />
                        </div>
                        <div className="rtl mb-2 col-4">
                            <label>שם משפחה</label>
                            <input className="form-control"
                                name="lastName" onChange={handleAddChange}
                                value={addInputs.lastName}
                            />
                        </div>
                        <div className="rtl mb-2 col-4">
                            <label>שם פרטי</label>
                            <input className="form-control"
                                name="firstName" onChange={handleAddChange}
                                value={addInputs.firstName}
                            />
                        </div>
                    </div>
                    {/* department, vehicle */}
                    <div className="row">
                        <div className="rtl mb-2 col-6">
                            <label>כלי תחבורה</label>
                            <select className="form-control"
                                name="vehicleId" onChange={handleAddChange}
                            >
                                <option value=""></option>
                                {extraObjectData.vehicles.map(object => {
                                    return (
                                        <option value={object.vehicleId}>{object.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>מחלקה שולחת</label>
                            <input className="form-control"
                                name="department" onChange={handleAddChange}
                                value={addInputs.department}
                            />
                        </div>
                    </div>
                    {/* approver, clerk */}
                    <div className="row">
                        <div className="rtl mb-2 col-6">
                            <label>פקיד</label>
                            <input className="form-control" disabled
                                name="department" onChange={handleAddChange}
                                value={addInputs.department}
                            />
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>המאשר</label>
                            <select className="form-control"
                                name="approverId" onChange={handleAddChange}
                            >
                                <option value=""></option>
                                {extraObjectData.approvers.map(object => {
                                    return (
                                        <option value={object.approverId}>{object.fullName}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    {/* approver, clerk */}
                    <div className="row">
                        <div className="rtl mb-2 col-6">
                            <label>מכון</label>
                            <input className="form-control" disabled
                                name="department" onChange={handleAddChange}
                                value={addInputs.department}
                            />
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>בית חולים</label>
                            <select className="form-control"
                                name="hospitalId" onChange={handleAddChange}
                            >
                                <option value=""></option>
                                {extraObjectData.hospitals.map(object => {
                                    return (
                                        <option value={object.hospitalId}>{object.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
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
                        {`למחוק את ה${objectProps.nameHebrew} ${data.nodes.find(object => object[objectProps.id] == deletingId)?.hospitalizationId}?`}
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