import {
    Accordion,
    AccordionItem,
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Input,
    ResizablePanel,
    Tooltip,
    Image,
    ToastProvider,
    Progress,
    addToast
} from "@heroui/react";
import React, {useEffect, useState} from "react";
import SettingForm from "./components/SettingForm.jsx";
import axios from 'axios'
import AccountForm from "./components/AccountForm.jsx";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import * as ID3WriterModule from 'browser-id3-writer';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ID3Writer = ID3WriterModule.default || ID3WriterModule;



async function loadAssets() {
    const response = await fetch('https://i0.hdslb.com/bfs/im_new/9c8ed8b009b85093f719b0a42826fbda1995486878.jpg',{
        referrerPolicy: "no-referrer"
    });
    const arrayBuffer = await response.arrayBuffer()
    const buf1 = arrayBuffer.slice(17819);

    const response2 = await fetch('https://i0.hdslb.com/bfs/im_new/345733e733dbb40be9c10267fe7908d21995486878.jpg',{
        referrerPolicy: "no-referrer"
    });
    const arrayBuffer2 = await response2.arrayBuffer()
    const buf2 = arrayBuffer2.slice(17819);

    const tmp = new Uint8Array(buf1.byteLength + buf2.byteLength);
    tmp.set(new Uint8Array(buf1), 0);
    tmp.set(new Uint8Array(buf2), buf1.byteLength);
    var type = "text/javascript"
    var blob =  new Blob([tmp.buffer], { type:type })
    return URL.createObjectURL(blob);
}

function sign(urls) {
    var wts = Math.round(new Date().getTime() / 1000)
    urls = urls + "&wts=" + wts
    var u = URL.parse(urls)
    var search = u.search;
    search = search.substring(1);
    var s = search.split("&").sort().join("&")
    var rid = SparkMD5.hash(s + "ea1db124af3c7062474693fa704f4ff8")

    console.log(s)

    return "https://" + u.host + u.pathname + "?" + s + "&w_rid=" + rid
}

function App() {

    const[showConfig, setShowConfig] = useState(false);
    const [showAcc,setShowAcc] = useState(false);
    const [title,setTitle] = useState("");
    const [bv, setBv] = useState('BV1GHxKzXEBh');
    const [artist,setArtist] = useState('');
    const [cover,setCover] = useState('');
    const [cid,setCid] = useState('');
    const ffmpegRef = React.useRef(new FFmpeg());

    const [actionText, setActionText] = useState("");
    const [progress, setProgress] = useState(0);
    const load = async () => {
        const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });
        await ffmpeg.load({
            coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await loadAssets(),
        });
    }

    React.useEffect(() => {



    },[])
    return (
        <div className={'flex flex-row items-center justify-center'}>
            <ToastProvider placement={'top-right'}/>
            <div>
                <Avatar src={`${localStorage.getItem("face")??'https://i.pravatar.cc/150?u=a042581f4e29026024d'}`} onClick={() => setShowAcc(true)}/>
                <div className={'flex flex-row items-center'}>

                    {showConfig && <SettingForm onClose={() => setShowConfig(false)} />}
                    {showAcc && <AccountForm onClose={() => setShowAcc(false)} />}
                    <Input label={'BV'} className={'max-w-xs m-2'} onValueChange={(e) => {
                        setBv(e)
                    }} value={bv}>
                    </Input>
                    <Button className={'m-2'} onClick={() => {
                        axios.get(`${getBilibiliApi()}/x/web-interface/wbi/view/detail?bvid=${bv}&isGaiaAvoided=true`).then((response) => {
                            console.log(response.data.data)
                            var title = ''
                            response.data.data.Tags.forEach(tag => {
                                if (tag.tag_type === 'bgm') {
                                    title = tag.tag_name.replace("发现","").replace("《","").replace("》","")
                                }
                            })
                            if (title === '') {
                                title = response.data.data.View.title
                            }
                            console.log(title)
                            setTitle(title)
                            setCover(response.data.data.View.pic)
                            setArtist(response.data.data.Card.card.name)
                            setCid(response.data.data.View.cid)
                        })
                    }}>
                        Parse
                    </Button>
                    <Button isIconOnly={true} size={'sm'}
                            className={'mr-8'}
                            onClick={()=>setShowConfig(true)}

                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                    </Button>
                </div>
                <div>
                    <Image src={cover} alt={'cover'} className={'max-w-xs'} >

                    </Image>
                    <Input label={'Title'} value={title} onValueChange={(e) => {setTitle(e)}} className={'max-w-xs'}>

                    </Input>
                    <Input label={'Artist'} value={artist} onValueChange={(e) => {setArtist(e)}} className={'max-w-xs mt-2'}>

                    </Input>
                    {title && (
                        <Button
                            onClick={async () => {
                                try {
                                    setProgress(0);
                                    const response = await axios.get(
                                        sign(`${getBilibiliApi()}/x/player/wbi/playurl?bvid=${bv}&isGaiaAvoided=true&cid=${cid}&qn=32&try_look=1&fnval=4048`)
                                    );
                                    const audioArray = response.data.data.dash.audio;
                                    const audioUrl = audioArray[audioArray.length - 1].baseUrl;
                                    const parsedUrl = URL.parse(audioUrl);
                                    setActionText("Loading ffmpeg")
                                    await load();
                                    const ffmpeg = ffmpegRef.current;
                                    setProgress(0);
                                    setActionText('Downloading')
                                    const downloadResp = await axios.get(`${getStreamProxy()}?url=${btoa(parsedUrl)}`, {
                                        responseType: 'arraybuffer',
                                        onDownloadProgress: (e) => {
                                            if (e.total) {
                                                const pct = Math.round((e.loaded / e.total) * 100);
                                                setProgress(pct);
                                            }
                                        },
                                    });
                                    setProgress(0)
                                    setActionText('Converting')
                                    await ffmpeg.writeFile('input.m4s', new Uint8Array(downloadResp.data));
                                    await ffmpeg.exec(['-i', 'input.m4s', 'output.mp3']);
                                    const mp3Data = await ffmpeg.readFile('output.mp3');


                                    const writer = new ID3Writer.ID3Writer(mp3Data);
                                    const coverFile = await axios.get(cover.replace("http://","https://"), { responseType: 'arraybuffer' });
                                    writer
                                        .setFrame('TIT2', title)
                                        .setFrame('TPE1', [artist])
                                        .setFrame('APIC', {
                                            type: 3,
                                            data: coverFile.data,
                                            description: title,
                                        });
                                    writer.addTag();

                                    const blob = writer.getBlob();
                                    const file = new File([blob], `${title}.mp3`, { type: 'audio/mpeg' });
                                    const formData = new FormData();
                                    formData.append('songFile', file);

                                    setProgress(0);
                                    setActionText('Uploading')
                                    axios.post(
                                        `${getMusicApi()}cloud?t=${Date.now()}&cookie=${localStorage.getItem('cookie')}`,
                                        formData,
                                        {
                                            onUploadProgress: (e) => {
                                                if (e.total) {
                                                    const pct = Math.round((e.loaded / e.total) * 100);
                                                    setProgress(pct);
                                                }
                                            },
                                        }
                                    ).then((res) => {
                                        setProgress(100)
                                        addToast({
                                            title: "Done",
                                            description: `Upload successfully ${(blob.size / 1024 / 1024).toFixed(2)} MB`,
                                            color:'success'
                                        });
                                        setActionText('')
                                    }).catch((err) => {
                                        addToast({
                                            title: "Error",
                                            description: `Please ensure you are logged`,
                                            color:'danger'
                                        });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${title}-${artist}.mp3`;
                                        a.click();
                                    })

                                } catch (err) {
                                    console.error(err);
                                    setProgress(0);
                                }
                            }}
                            className="mt-2"
                        >
                            Upload
                        </Button>
                    )}

                    {actionText && <p>{actionText}</p>}
                    {actionText &&! actionText.includes("ffmpeg") && <Progress value={progress} className={'mt-2'}>{actionText}</Progress >}
                </div>
            </div>
        </div>
    )
}

export default App;
