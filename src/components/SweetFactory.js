import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";


const SweetFactory = ({ userObj }) => {
    const [sweet, setSweet] = useState("");
    const [attachment, setAttachment] = useState("")
    const onSubmit = async (event) =>{
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef = storageService
            .ref()
            .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const sweetObj = { 
            text:sweet,
            createdAt: Date.now(),
            craetorId : userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("sweets").add(sweetObj);
         setSweet("");
         setAttachment("");
    };
    const onChange = (event)=>{
        const { target:{value},
    } = event;
    setSweet(value);
    };
    const onFileChange = (event) => {
        const {
          target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
              } = finishedEvent;
              setAttachment(result);
            };
            reader.readAsDataURL(theFile);
          };
    const onClearAttactment = () => setAttachment(null)
    return(
    <form onSubmit={onSubmit}>
        <input 
        value={sweet} 
        onChange={onChange} 
        type="text" 
        placeholder="what's on your mind?" 
        maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Sweet" />
        {attachment && (
        <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttactment}>Clear</button>
        </div>
            )}
    </form>
    )

}

export default SweetFactory