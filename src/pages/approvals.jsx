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

export function ApprovalsPage() {
    var objectType = "approvers"

    var objectProps = {
        id:"approverId",
        columns:[
            ["name","שם"],
            ["fullName","שם מלא"]
        ]
    }

    const { token } = useContext(AppContext)
    var [objectData, setObjectData] = useState(null)
    var navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var data = await objectService.getObjectList(objectType, token)
        if(typeof data == "number") navigate("/")
        setObjectData(data)
    }

    if (objectData == null) return <div>Loading...</div>

    const data = { nodes: objectData }

    return (
        <>
            <ObjectTable data={data} objectProps={objectProps} width={100} />
        </>
    )
}