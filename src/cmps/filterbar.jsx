import { useEffect } from "react"

export default function FilterBar({ text, setText, showExtraFilters = false, extraObjectData = null,
    extraFilters, setExtraFilters
}) {


    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setExtraFilters(values => ({ ...values, [name]: value }))
    }

    useEffect(() => {
        console.log(text)
    }, [text])

    return (
        <>
            <input value={text} onChange={(e) => setText(e.target.value)}
                className="form-control filter-bar-input"
                placeholder="חיפוש לפי תעודת זהות או מספר אשפוז..."
            />
            {showExtraFilters ?
                <div className="extra-filter m-2">
                    <input
                        className="form-control ms-2"
                        list="hospitals"
                        name="hospitals"
                        value={extraFilters.hospitals}
                        onChange={handleChange}
                        placeholder="בית חולים"
                    />
                    <datalist id="hospitals">
                        {extraObjectData.hospitals.map(opt => {
                            return <option value={opt.name} />
                        })}
                    </datalist>

                    <input
                        className="form-control ms-2"
                        list="tests"
                        name="tests"
                        value={extraFilters.tests}
                        onChange={handleChange}
                        placeholder="סוג בדיקה"
                    />
                    <datalist id="tests">
                        {extraObjectData.tests.map(opt => {
                            return <option value={opt.name} />
                        })}
                    </datalist>

                    <input
                        className="form-control"
                        list="approvers"
                        name="approvers"
                        value={extraFilters.approvers}
                        onChange={handleChange}
                        placeholder="מאשר"
                    />
                    <datalist id="approvers">
                        {extraObjectData.approvers.filter(opt => opt.allowed).map(opt => {
                            return <option value={opt.fullName} />
                        })}
                    </datalist>

                </div>
                : <></>
            }
        </>
    )
}