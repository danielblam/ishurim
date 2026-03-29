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

export function InstitutesPage() {

    var objectType = "institutes"

    var objectProps = {
        id:"instituteId",
        columns:[
            ["name","שם"],
            ["hospitalName","בית חולים"]
        ]
    }

    const { token } = useContext(AppContext)
    var [objectData, setObjectData] = useState(null)
    var navigate = useNavigate();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var data1 = await objectService.getObjectList(objectType, token)
        if(typeof data1 == "number") navigate("/")
        var data2 = await objectService.getObjectList("hospitals", token)
        setObjectData(data1.map(institute => {
            return {
                instituteId:institute.instituteId,
                name:institute.name,
                hospitalId:institute.hospitalId,
                hospitalName:data2.find(hospital => hospital.hospitalId == institute.hospitalId).name
            }
        }))
    }

    if (objectData == null) return <div>Loading...</div>

    const data = { nodes: objectData }

    return (
        <>
            <ObjectTable data={data} objectProps={objectProps} />
        </>
    )
}