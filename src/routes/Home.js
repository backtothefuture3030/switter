import React, { useEffect, useState } from "react" ;
import Sweet from "components/Sweet"
import { dbService, storageService } from "fbase";
import SweetFactory from "components/SweetFactory";

const Home= ({userObj}) => {
    const [sweets, setSweets] = useState([]);
    useEffect(() => {
        dbService.collection("sweets").onSnapshot(snapshot => {
            const sweetArray = snapshot.docs.map(doc =>({
                id:doc.id, 
                ...doc.data(),
            }));
            setSweets(sweetArray);
        });
    }, []);
    return (
    <div>
        <SweetFactory userObj={userObj}/>
        <div>
            {sweets.map((sweet) => (
                <Sweet key={sweet.id} sweetObj={sweet} isOwner={sweet.craetorId === userObj.uid}/>
            ))}
        </div>
    </div>
    );
};
export default Home;