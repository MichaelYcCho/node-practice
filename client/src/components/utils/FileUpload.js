import React from 'react'
import Dropzone from 'react-dropzone'
import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';

function FileUpload() {

    const dropHandler = (files) => {

        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
        }

        FormData.append("file", files[0])

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {

                } else {
                    alert('파일 저장 실패')
                }

            })
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <EditOutlined type="plus" style={{ fontSize: '3rem' }} />
                    </div>
                )}
            </Dropzone>
        </div>
    )
}

export default FileUpload