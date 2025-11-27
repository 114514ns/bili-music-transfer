import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Avatar
} from "@heroui/react";
import {QRCodeSVG} from 'qrcode.react';
import axios from 'axios'
function AccountForm(props) {

    const [logged,setLogged] = React.useState(false);
    const [key, setKey] = React.useState('');
    const [profile,setProfile] = React.useState({});


    React.useEffect(() => {
        var cookie = localStorage.getItem("cookie");
        axios({
            url:`${getMusicApi()}login/status`,
            method: 'POST',
            data: {
                cookie
            }
        }).then((response) => {
            setLogged(response.data.data.profile !== null);
            if (response.data.data.profile !== null) {
                setProfile(response.data.data.profile)
                localStorage.setItem("face",response.data.data.profile.avatarUrl)
            }
        })
    }, [logged]);
    React.useEffect(() => {
        if (!logged) {
            axios.get(`${getMusicApi()}login/qr/key?t=${new Date().getTime()}`).then((response) => {
                setKey(response.data.data.unikey)
            })
        }
    },[logged])
    React.useEffect(() => {
        if (!logged && key) {
            var ref = setInterval(() => {
                axios.get(`${getMusicApi()}login/qr/check?t=${new Date().getTime()}&key=${key}&&noCookie=true`).then((response) => {
                    if (response.data.code === 803) {
                        document.cookie = response.data.cookie
                        localStorage.setItem("cookie",response.data.cookie)
                        clearInterval(ref)
                        setLogged(true)
                    }
                })
            },1000)
        }
        return () => clearInterval(ref)
    },[key])
    return (
        <div>
            <Modal isOpen={true} onOpenChange={props.onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                    <ModalBody className={'flex flex-col items-center justify-center'}>
                        {!logged && key && <QRCodeSVG value={'https://music.163.com/login?codekey=' + key} />}
                        {logged && (
                            <Avatar src={profile.avatarUrl}/>
                        )}
                        {logged && <span>{profile.nickname}</span>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={props.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}



export default AccountForm;