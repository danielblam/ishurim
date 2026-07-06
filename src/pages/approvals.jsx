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
import FilterBar from "../cmps/filterbar";

export function ApprovalsPage() {
    var objectType = "approvals"

    var objectProps = {
        id: "approvalId",
        nameHebrew: "אישור",
        columns: [
            ["hospitalizationId", "מספר אשפוז"],
            ["approvalDate", "תאריך"],
            ["testId", "סוג בדיקה", "tests"],
            ["firstName", "שם פרטי"],
            ["lastName", "שם משפחה"],
            ["idNumber", "תעודת זהות"],
            ["departmentId", "מחלקה שולחת"],
            ["vehicleId", "כלי תחבורה", "vehicles"],
            ["approverId", "המאשר", "approvers"],
            ["clerkId", "פקיד", "users"],
            ["hospitalId", "בית חולים"],
            ["instituteId", "מכון", "institutes"]
        ]
    }

    var [extraFilters, setExtraFilters] = useState({
        hospitals:"",
        tests:"",
        approvers:""
    })

    console.log(extraFilters)

    const { token } = useContext(AppContext)
    var [objectData, setObjectData] = useState(null)
    var [extraObjectData, setExtraObjectData] = useState({})
    var navigate = useNavigate();

    var [filterText, setFilterText] = useState("")

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var data = await objectService.getObjectList(objectType, token)
        if (typeof data == "number") navigate("/")

        var tests = await objectService.getObjectList("tests", token)
        var vehicles = await objectService.getObjectList("vehicles", token)
        var approvers = await objectService.getObjectList("approvers", token)
        var institutes = await objectService.getObjectList("institutes", token)
        var hospitals = await objectService.getObjectList("hospitals", token)
        var users = await objectService.getObjectList("users", token)
        var departments = await objectService.getObjectList("departments", token)

        setObjectData(data)
        setExtraObjectData({
            tests: tests,
            vehicles: vehicles,
            approvers: approvers,
            institutes: institutes,
            hospitals: hospitals,
            users: users,
            departments: departments
        })

    }

    if (objectData == null) return <div>Loading...</div>

    const data = {
        nodes: objectData.toSorted((a, b) => { // sort by date
            if (a.date == null) return 1
            if (b.date == null) return -1
            var aList = a.date.split("-")
            var bList = b.date.split("-")
            var aDate = new Date(Number(aList[0]), Number(aList[1]) - 1, Number(aList[2]))
            var bDate = new Date(Number(bList[0]), Number(bList[1]) - 1, Number(bList[2]))
            return bDate - aDate
        }).filter(obj => { // filter by id number or hospitalization id
            if (String(obj.idNumber).includes(filterText)) return true
            if (String(obj.hospitalizationId).includes(filterText)) return true
            return false
        }).filter(obj => { // extra filters
            var hospitalId = extraObjectData.institutes.find(i => i.instituteId == obj.instituteId).hospitalId
            var hospitalName = extraObjectData.hospitals.find(h => h.hospitalId == hospitalId)?.name
            if(extraFilters.hospitals && !hospitalName?.includes(extraFilters.hospitals)) return false

            var testName = extraObjectData.tests.find(t => t.testId == obj.testId).name
            if(extraFilters.tests && !testName?.includes(extraFilters.tests)) return false

            var approverName = extraObjectData.approvers.find(a => a.approverId == obj.approverId).fullName
            if(extraFilters.approvers && !approverName?.includes(extraFilters.approvers)) return false

            return true
        })
    }

    return (
        <div className="approvals-page-container">
            <FilterBar text={filterText} setText={setFilterText} showExtraFilters extraObjectData={extraObjectData}
            extraFilters={extraFilters} setExtraFilters={setExtraFilters}
            />
            <ApprovalTable data={data} objectType={objectType} objectProps={objectProps}
                setObjectData={setObjectData} extraObjectData={extraObjectData} />
        </div>
    )
}