import React, { useRef, useState } from 'react'
import {Container, Form, Button} from 'react-bootstrap'
import {v4} from 'uuid'


export default function Login({onIdSubmit}) {
    const idRef = useRef()

    function formSubmit(e){
        e.preventDefault()
        onIdSubmit(idRef.current.value)
    }

    function createNewId(e){
        const newId = v4()
        idRef.current.value= newId
    }

    return (
        <Container className='align-items-center d-flex' style={{ height: '100vh'}}>
            <Form onSubmit={formSubmit} className='w-100'>
                <Form.Group>
                    <Form.Label className=''>Enter Your Id</Form.Label>
                    <Form.Control type="text" ref={idRef} required/>
                </Form.Group>
                <Button type='submit' className='mr-2'>Login</Button>
                <Button onClick = {createNewId} variant='secondary'>Create A New Id</Button>
            </Form>
        </Container>
    )
}
