import React, { useEffect, useState } from "react" ;

import Sweet from "components/Sweet"
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

const Home= ({userObj}) => {
    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    const [attachment, setAttachment] = useState()
    useEffect(() => {
        dbService.collection("sweets").onSnapshot(snapshot => {
            const sweetArray = snapshot.docs.map(doc =>({
                id:doc.id, 
                ...doc.data(),
            }));
            setSweets(sweetArray);
        });
    }, []);
    const onSubmit = async (event) =>{
        event.preventDefault();
        const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
        const response = await fileRef.putString(attachment, "data_url");
        console.log(response);

        // await dbService.collection("sweets").add({
        //     text:sweet,
        //     createdAt: Date.now(),
        //     craetorId : userObj.uid,
        // });
        // setSweet("");
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

    return (
    <div>
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
        <div>
            {sweets.map((sweet) => (
                <Sweet key={sweet.id} sweetObj={sweet} isOwner={sweet.craetorId === userObj.uid}/>
            ))}
        </div>
    </div>
    );
};
export default Home;