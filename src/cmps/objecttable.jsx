import {
    Table,
    Header,
    HeaderRow,
    HeaderCell,
    Body,
    Row,
    Cell,
} from '@table-library/react-table-library/table';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function ObjectTable({ data, objectProps, width = "50" }) {
    console.log(data)

    const [show, setShow] = useState(false);

    const [editingId, setEditingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="rtl">
                <div className={`rtl-table w-${width}`}>
                    <Table data={data}>
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
                                    {tableList.map((item) => (
                                        <Row key={item[objectProps.id]} item={item}>
                                            {objectProps.columns.map(column => {
                                                var value = column[0]
                                                return <Cell>{item[value]}</Cell>
                                            })}
                                            <Cell>
                                                <button className="btn p-0">❌</button>
                                                <button className="btn p-0">✏️</button>
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
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {objectProps.columns.map(column => {
                        return (
                            <div className="rtl mb-2">
                                <label>{column[1]}</label>
                                <input className="form-control"></input>
                            </div>
                        )
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}