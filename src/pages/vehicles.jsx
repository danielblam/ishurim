import { useContext, useEffect, useState } from "react"
import { AppContext } from "../AppContext"
import { objectService } from "../services/objectservice"
import { ObjectTable } from "../cmps/objecttable"
import { useNavigate } from "react-router-dom"

export function VehiclesPage() {

    var objectType = "vehicles"

    var objectProps = {
        id:"vehicleId",
        nameHebrew:"כלי תחבורה",
        columns:[
            ["name","שם"]
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
            <ObjectTable data={data} objectType={objectType} objectProps={objectProps} 
            setObjectData={setObjectData}/>
        </>
    )
}