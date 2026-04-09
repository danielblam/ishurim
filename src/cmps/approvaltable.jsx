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

import { useContext, useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { objectService } from '../services/objectservice';
import { AppContext } from "../AppContext"
import { useSearchParams } from 'react-router-dom';

export function ApprovalTable({ data, objectType, objectProps, width = "100", setObjectData, extraObjectData }) {

    const { token, userId } = useContext(AppContext)


    // const theme = useTheme(getTheme());
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

    const [addInputs, setAddInputs] = useState({
        approvalId: 0,
        clerkId: Number(userId),
        note: ""
    })
    const [instituteDisabled, setInstituteDisabled] = useState(true)

    const [searchParams, setSearchParams] = useSearchParams()

    const [show, setShow] = useState(searchParams.get("create") == "true");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        setShow(searchParams.get("create") === "true");
    }, [searchParams]);

    const [showDelete, setShowDelete] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const handleCloseDelete = () => setShowDelete(false)
    const handleShowDelete = () => setShowDelete(true)

    const handleAddChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (["approverId", "clerkId", "hospitalId", "instituteId", "testId", "vehicleId"].includes(name))
            setAddInputs(values => ({ ...values, [name]: Number(value) }))
        else {
            setAddInputs(values => ({ ...values, [name]: value }))
        }
        if (name == "hospitalId") {
            setInstituteDisabled(value == "")
        }
    }

    const resetAddInputs = () => {
        setAddInputs({
            approvalId: 0,
            clerkId: Number(userId),
            note: ""
        })
    }

    const handleAddNew = async () => {
        console.log(addInputs)
        if (Object.keys(addInputs).length < 14) return
        for (const input of Object.keys(addInputs)) {
            if (["approvalId", "clerkId", "note"].includes(input)) continue
            if (!addInputs[input]) return
        }
        console.log("Can go through")
        if (editingId) await objectService.editObject(objectType, token, addInputs)
        else {
            await objectService.addObject(objectType, token, addInputs)
        }
        setObjectData(await objectService.getObjectList(objectType, token))
        resetAddInputs()
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
        setInstituteDisabled(false)
        var approvals = data.nodes
        var editing = approvals.find(approval => approval.approvalId == id)
        console.log(editing)
        editing.hospitalId = findObject("institutes","instituteId",editing.instituteId).hospitalId
        setAddInputs(editing)
        handleShow()
    }

    const findObject = (objectName, objectIdName, objectId) => {
        return extraObjectData[objectName].find(object => object[objectIdName] == objectId)
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
                                        <HeaderCell>מספר שובר</HeaderCell>
                                        <HeaderCell>מספר אשפוז</HeaderCell>
                                        <HeaderCell>תאריך</HeaderCell>
                                        <HeaderCell>בית חולים</HeaderCell>
                                        <HeaderCell>מכון</HeaderCell>
                                        <HeaderCell>סוג בדיקה</HeaderCell>
                                        <HeaderCell>המאשר</HeaderCell>
                                        <HeaderCell>פקיד</HeaderCell>
                                        <HeaderCell>שם החולה</HeaderCell>
                                        <HeaderCell>תעודת זהות</HeaderCell>
                                        <HeaderCell>פעולות</HeaderCell>
                                    </HeaderRow>
                                </Header>
                                <Body>
                                    {tableList.map((item, index) => (
                                        <Row key={item.approvalId} item={item} onDoubleClick={() => {
                                            //console.log(`clicked this row! ${item.approvalId}`)
                                        }}>
                                            <Cell>{item.approvalId}</Cell>
                                            <Cell>{item.hospitalizationId}</Cell>
                                            <Cell>{item.approvalDate.split("-").reverse().join("/")}</Cell>
                                            <Cell>{(() => {
                                                var hospitalId = findObject("institutes", "instituteId", item.instituteId).hospitalId
                                                var hospital = findObject("hospitals", "hospitalId", hospitalId)
                                                return hospital.name
                                            })()}</Cell>
                                            <Cell>{findObject("institutes", "instituteId", item.instituteId).name}</Cell>
                                            <Cell>{findObject("tests", "testId", item.testId).name}</Cell>
                                            <Cell>{findObject("approvers", "approverId", item.approverId).fullName}</Cell>
                                            <Cell>{findObject("users", "userId", item.clerkId).fullName}</Cell>
                                            <Cell>{`${item.firstName} ${item.lastName}`}</Cell>
                                            <Cell>{item.idNumber}</Cell>
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
                    resetAddInputs()
                    setEditingId(null)
                }}>➕ להוסיף חדש</button>
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
                                value={addInputs.approvalId ? addInputs.approvalId : ""}
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
                                value={addInputs.testId}
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
                            <input className="form-control" maxLength={9}
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
                                value={addInputs.vehicleId}
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
                                name="clerkId" onChange={handleAddChange}
                                value={extraObjectData.users.find(user => user.userId == userId).fullName}
                            />
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>המאשר</label>
                            <select className="form-control"
                                name="approverId" onChange={handleAddChange}
                                value={addInputs.approverId}
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
                    {/* hospital, institute */}
                    <div className="row">
                        <div className="rtl mb-2 col-6">
                            <label>מכון</label>
                            <select className="form-control" disabled={instituteDisabled}
                                name="instituteId" onChange={handleAddChange}
                                value={addInputs.instituteId}
                            >
                                <option value=""></option>
                                {extraObjectData.institutes.filter(inst => inst.hospitalId == addInputs.hospitalId).map(object => {
                                    return (
                                        <option value={object.instituteId}>{object.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="rtl mb-2 col-6">
                            <label>בית חולים</label>
                            <select className="form-control"
                                name="hospitalId" onChange={handleAddChange}
                                value={addInputs.hospitalId}
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
                    <div className="rtl">
                        <label>הערה</label>
                        <textarea className="form-control dont-resize" rows="3" maxLength={300}
                            name="note" onChange={handleAddChange}
                            value={addInputs.note}>

                        </textarea>
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