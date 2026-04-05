import { useContext, useEffect, useState } from "react"
import { objectService } from "../services/objectservice"
import { AppContext } from "../AppContext"
import { CompactTable } from '@table-library/react-table-library/compact'

import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
} from '@table-library/react-table-library/table';
import { ObjectTable } from "../cmps/objecttable";
import { useNavigate } from "react-router-dom";
import { ApprovalTable } from "../cmps/approvaltable";

export function ApprovalsPage() {
    var objectType = "approvals"

    var objectProps = {
        id:"approvalId",
        nameHebrew:"אישור",
        columns:[
            ["hospitalizationId","מספר אשפוז"],
            ["approvalDate","תאריך"],
            ["testId","סוג בדיקה","tests"],
            ["firstName", "שם פרטי"],
            ["lastName", "שם משפחה"],
            ["idNumber","תעודת זהות"],
            ["department","מחלקה שולחת"],
            ["vehicleId","כלי תחבורה","vehicles"],
            ["approverId","המאשר","approvers"],
            ["clerkId","פקיד","users"],
            ["hospitalId","בית חולים"],
            ["instituteId","מכון","institutes"]
        ]
    }

    const { token } = useContext(AppContext)
    var [objectData, setObjectData] = useState(null)
    var [extraObjectData, setExtraObjectData] = useState({})
    var navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var data = await objectService.getObjectList(objectType, token)
        if(typeof data == "number") navigate("/")
            
        var tests = await objectService.getObjectList("tests", token)
        var vehicles = await objectService.getObjectList("vehicles", token)
        var approvers = await objectService.getObjectList("approvers", token)
        var institutes = await objectService.getObjectList("institutes", token)
        var hospitals = await objectService.getObjectList("hospitals", token)
        var users = await objectService.getObjectList("users", token)
            
        setObjectData(data)
        setExtraObjectData({
            tests:tests,
            vehicles:vehicles,
            approvers:approvers,
            institutes:institutes,
            hospitals:hospitals,
            users:users
        })

    }

    if (objectData == null) return <div>Loading...</div>

    const data = { nodes: objectData }

    return (
        <>
            <ApprovalTable data={data} objectType={objectType} objectProps={objectProps}
                setObjectData={setObjectData} extraObjectData={extraObjectData} />
        </>
    )
}