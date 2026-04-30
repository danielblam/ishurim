import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { authService } from "../services/authservice";
import { AppContext } from "../AppContext";

export function LoginPage() {

    const { token, setToken, username, setUsername, role, setRole } = useContext(AppContext)

    var [inputs, setInputs] = useState({
        name: "",
        password: ""
    })
    var [failText, setFailText] = useState("")
    var navigate = useNavigate()

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    useEffect(() => {
        windowsLogIn()
    }, [])

    const windowsLogIn = async () => {
        var result = await authService.windowsLogin()
        if (typeof result == "number") {
            switch(result) {
                case 401:
                    navigate("/fail", { state: { refresh: true } })
                    // setFailText("כניסה אוטומטית נכשלה.")
                    return
            }
        }
        setFailText("")
        authService.saveToken(result.token, result.name, result.role)
        setToken(result.token)
        setUsername(result.name)
        setRole(result.role)
        navigate("/dash", { state: { refresh: true } })
    }

    const logIn = async () => {
        if(!inputs.name || !inputs.password) {
            setFailText("חסר שם ו/או סיסמה.")
            return
        }
        var result = await authService.login(inputs)
        if (typeof result == "number") {
            switch(result) {
                case 401:
                    setFailText("סיסמה שגויה.")
                    return
                case 404:
                    setFailText("משתמש הזה לא קיים.")
                    return
            }
        }
        setFailText("")
        authService.saveToken(result.token, inputs.name, result.role)
        setToken(result.token)
        setUsername(inputs.name)
        setRole(result.role)
        navigate("/dash", { state: { refresh: true } })
    }

    return (
        <div className="login-page-container fs-5 bg-light">
            <div className="login-container shadow-lg bg-white">
                <div>
                    <h3>כניסה למערכת אישורים</h3>
                </div>
                <div className="mt-4 form-row">
                    <div className="ms-1">שם</div>
                    <input className="form-control" 
                    name="name" value={inputs.name} onChange={handleChange}></input>
                </div>
                <div className="mt-1 form-row">
                    <div>סיסמה</div>
                    <input type="password" className="form-control"
                    name="password" value={inputs.password} onChange={handleChange}></input>
                </div>
                <div className="mb-3 mt-3 login-fail text-danger rtl">{failText}</div>
                <div>
                    <button onClick={() => logIn()} className="btn btn-primary fw-bold">כניסה</button>
                </div>
            </div>
        </div>
    )
}