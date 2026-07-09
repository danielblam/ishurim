import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';

export function ExportModal({ show, handleClose, extraObjectData, getXlsx }) {

    const maxYear = new Date().getFullYear() + 10
    const hebrewMonths = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
    const quarterNumbers = [1, 2, 3, 4]

    const getInitialSettings = () => {
        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        return {
            // date range
            "dateRange": "all",
            // month range
            "startYear": year,
            "startMonth": month,
            "endYear": year,
            "endMonth": month,
            // quarter
            "quarterYear": year,
            "quarterNumber": Math.floor(month / 3),
            // by institutes or hospitals,
            "byInstitutesOrHospitals": "all",
            "instituteIds": [],
            "hospitalIds": [],
            // by department,
            "byDepartments": "all",
            "departmentIds": [],
            // by test type
            "byTests": "all",
            "testIds": []
        }
    }
    const [exportSettings, setExportSettings] = useState(getInitialSettings)

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        console.log(name, value)
        setExportSettings(values => ({ ...values, [name]: value }))
    }

    const instituteData = extraObjectData.institutes.map(institute => {
        let value = institute.instituteId
        let instituteName = institute.name
        let hospitalName = extraObjectData.hospitals.find(hospital => hospital.hospitalId == institute.hospitalId)?.name
        let label = `${instituteName}${!hospitalName ? "" : ` (${hospitalName})`}`
        return {
            value: value, label: label
        }
    })
    const hospitalData = extraObjectData.hospitals.map(hospital => ({ value: hospital.hospitalId, label: hospital.name }))
    const departmentData = extraObjectData.departments.map(department => ({ value: department.departmentId, label: department.name }))
    const testData = extraObjectData.tests.map(test => ({ value: test.testId, label: test.name }))

    const [selectedHospitals, setSelectedHospitals] = useState([])
    const [selectedInstitutes, setSelectedInstitutes] = useState([])

    const handleFinish = () => {
        getXlsx(exportSettings)
    }

    return (
        <Modal show={show} onHide={handleClose} dialogClassName='extra-medium'>
            <Modal.Header closeButton className="rtl">
                <h4>
                    ייצוא דוח אישורים לאקסל
                </h4>
            </Modal.Header>
            <Modal.Body>
                <div className='rtl'>
                    <h5>תקופת הדוח</h5>
                    <div className="row d-flex align-items-center">
                        <div className="rtl col-2">
                            <input
                                type="radio" name="dateRange" value="all"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.dateRange == "all"}
                                onChange={handleChange}
                            />
                            <label>הכל</label>
                        </div>
                        <div className="rtl col-3">
                            <input
                                type="radio" name="dateRange" value="monthRange"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.dateRange == "monthRange"}
                                onChange={handleChange}
                            />
                            <label>טווח חודשים</label>
                        </div>
                        <div className="rtl col-3">
                            <input
                                type="radio" name="dateRange" value="quarter"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.dateRange == "quarter"}
                                onChange={handleChange}
                            />
                            <label>רבעון</label>
                        </div>
                    </div>
                    {exportSettings.dateRange == "monthRange" ?
                        // month range or all. if all is selected, just disable all the inputs
                        <div>
                            <div className="row mt-2">
                                <div className="col-3">
                                    <label className="fw-bold">שנת התחלה</label>
                                </div>
                                <div className="col-3">
                                    <label className="fw-bold">חודש התחלה</label>
                                </div>
                                <div className="col-3">
                                    <label className="fw-bold">שנת סוף</label>
                                </div>
                                <div className="col-3">
                                    <label className="fw-bold">חודש סוף</label>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-3">
                                    <input
                                        type="number" className="form-control" min="2000" max={maxYear}
                                        name="startYear" value={exportSettings.startYear} onChange={handleChange}
                                    />
                                </div>
                                <div className="col-3">
                                    <select
                                        className="form-control"
                                        name="startMonth" value={exportSettings.startMonth} onChange={handleChange}
                                    >
                                        {hebrewMonths.map((month, index) => {
                                            return <option value={index}>{month}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <input
                                        type="number" className="form-control" min="2000" max={maxYear}
                                        name="endYear" value={exportSettings.endYear} onChange={handleChange}
                                    />
                                </div>
                                <div className="col-3">
                                    <select
                                        className="form-control"
                                        name="endMonth" value={exportSettings.endMonth} onChange={handleChange}
                                    >
                                        {hebrewMonths.map((month, index) => {
                                            return <option value={index}>{month}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        : exportSettings.dateRange == "quarter" ?
                            <div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label className="fw-bold">שנה</label>
                                    </div>
                                    <div className="col-3">
                                        <label className="fw-bold">רבעון</label>
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    <div className="col-3">
                                        <input
                                            type="number" className="form-control" min="2000" max={maxYear}
                                            name="quarterYear" value={exportSettings.quarterYear} onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <select
                                            className="form-control"
                                            name="quarterNumber" value={exportSettings.quarterNumber} onChange={handleChange}
                                        >
                                            {quarterNumbers.map((month, index) => {
                                                return <option value={index}>{month}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            : <></>
                    }


                    <h5 className="mt-4">בתי חולים / מכונים</h5>
                    <div className="row d-flex align-items-center">
                        <div className="rtl col-2">
                            <input
                                type="radio" name="byInstitutesOrHospitals" value="all"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byInstitutesOrHospitals == "all"}
                                onChange={handleChange}
                            />
                            <label>הכל</label>
                        </div>
                        <div className="rtl col-3">
                            <input
                                type="radio" name="byInstitutesOrHospitals" value="hospitals"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byInstitutesOrHospitals == "hospitals"}
                                onChange={handleChange}
                            />
                            <label>לפי בתי חולים</label>
                        </div>
                        <div className="rtl col-3">
                            <input
                                type="radio" name="byInstitutesOrHospitals" value="institutes"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byInstitutesOrHospitals == "institutes"}
                                onChange={handleChange}
                            />
                            <label>לפי מכונים</label>
                        </div>
                    </div>
                    {exportSettings.byInstitutesOrHospitals == "hospitals" ?
                        <div>
                            <div>
                                <label className="fw-bold mt-2">בחירת בתי חולים</label>
                            </div>
                            <div>
                                <Select className="my-2"
                                    placeholder="בחר בתי חולים..."
                                    options={hospitalData}
                                    closeMenuOnSelect={false}
                                    isMulti
                                    noOptionsMessage={() => "לא נמצאו אפשרויות"}
                                    value={selectedHospitals}
                                    onChange={(selected) => {
                                        setExportSettings(prev => ({ ...prev, hospitalIds: selected.map(s => s.value) }))
                                        setSelectedHospitals(selected)
                                    }
                                    }
                                />
                            </div>
                        </div>
                        : exportSettings.byInstitutesOrHospitals == "institutes" ?
                            <div>
                                <div>
                                    <label className="fw-bold mt-2">בחירת מכונים</label>
                                </div>
                                <div>
                                    <Select className="my-2"
                                        placeholder="בחר מכונים..."
                                        options={instituteData}
                                        closeMenuOnSelect={false}
                                        isMulti
                                        noOptionsMessage={() => "לא נמצאו אפשרויות"}
                                        value={selectedInstitutes}
                                        onChange={(selected) => {
                                            setExportSettings(prev => ({ ...prev, instituteIds: selected.map(s => s.value) }))
                                            setSelectedInstitutes(selected)
                                        }
                                        }
                                    />
                                </div>
                            </div>
                            : <></>
                    }


                    <h5 className="mt-4">מחלקות שולחות</h5>
                    <div className="row d-flex align-items-center">
                        <div className="rtl col-2">
                            <input
                                type="radio" name="byDepartments" value="all"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byDepartments == "all"}
                                onChange={handleChange}
                            />
                            <label>הכל</label>
                        </div>
                        <div className="rtl col-4">
                            <input
                                type="radio" name="byDepartments" value="departments"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byDepartments == "departments"}
                                onChange={handleChange}
                            />
                            <label>לפי מחלקות</label>
                        </div>
                    </div>
                    {exportSettings.byDepartments != "all" ?
                        <div>
                            <div>
                                <label className="fw-bold mt-2">בחירת מחלקות</label>
                            </div>
                            <div>
                                <Select className="my-2"
                                    placeholder="בחר מחלקות..."
                                    options={departmentData}
                                    closeMenuOnSelect={false}
                                    isMulti
                                    noOptionsMessage={() => "לא נמצאו אפשרויות"}
                                    onChange={
                                        (selected) => setExportSettings(prev => ({ ...prev, departmentIds: selected.map(s => s.value) }))
                                    }
                                />
                            </div>
                        </div>
                        : <></>
                    }

                    <h5 className="mt-4">סוג בדיקה</h5>
                    <div className="row d-flex align-items-center">
                        <div className="rtl col-2">
                            <input
                                type="radio" name="byTests" value="all"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byTests == "all"}
                                onChange={handleChange}
                            />
                            <label>הכל</label>
                        </div>
                        <div className="rtl col-4">
                            <input
                                type="radio" name="byTests" value="tests"
                                className="ms-2 form-check-input p-2"
                                checked={exportSettings.byTests == "tests"}
                                onChange={handleChange}
                            />
                            <label>לפי סוגי בדיקה</label>
                        </div>
                    </div>
                    {exportSettings.byTests != "all" ?
                        <div>
                            <div>
                                <label className="fw-bold mt-2">בחירת סוגי בדיקות</label>
                            </div>
                            <div>
                                <Select className="my-2"
                                    placeholder="בחר סוגי בדיקות..."
                                    options={testData}
                                    closeMenuOnSelect={false}
                                    isMulti
                                    noOptionsMessage={() => "לא נמצאו אפשרויות"}
                                    onChange={
                                        (selected) => setExportSettings(prev => ({ ...prev, testIds: selected.map(s => s.value) }))
                                    }
                                />
                            </div>
                        </div>
                        : <></>
                    }

                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary"
                onClick={() => handleFinish()}
                >
                    ייצא לאקסל
                </button>
            </Modal.Footer>
        </Modal>
    )
}