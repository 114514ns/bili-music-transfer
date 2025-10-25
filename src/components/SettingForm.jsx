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
} from "@heroui/react";
function SettingForm(props) {
    return (
        <div>
            <Modal isOpen={true} onOpenChange={props.onClose}>
                <ModalContent>
                            <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                            <ModalBody>
                                <Input
                                    className=" mt-4"
                                    label="Bilibili API"
                                    defaultValue={getBilibiliApi()}
                                    onValueChange={(value) => {
                                        localStorage.setItem("bilibili-api", value);
                                    }}
                                />
                                <Input
                                    className=" mt-4"
                                    label="CloudMusic API"
                                    defaultValue={getMusicApi()}
                                    onValueChange={(value) => {
                                        localStorage.setItem("music-api", value);
                                    }}
                                />
                                <Input
                                    className=" mt-4"
                                    label="Stream Proxy"
                                    defaultValue={getStreamProxy()}
                                    onValueChange={(value) => {
                                        localStorage.setItem("stream-proxy", value);
                                    }}
                                />
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



export default SettingForm;