import { dbService } from "fbase";
import React, { useState } from "react";

const Sweet = ({sweetObj, isOwner}) => {
        const [editing, setEditing] = useState(false);
        const [newSweet, setNewSweet] = useState(sweetObj.text);
        const onDeleteClick = async () => {
            const ok = window.confirm("정말 이 sweet을 삭제하시겠습니까?");
            if(ok){
                dbService.doc(`sweets/${sweetObj.id}`).delete();
            }
        };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`sweets/${sweetObj.id}`).update({
            text : newSweet,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {target:{value}}=event;
        setNewSweet(value)
    };
    return(
        <div>
            {editing ? (
                <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit your sweet"value={newSweet} required onChange={onChange}/>
                <input type="submit" value="Sweet 업데이트"/>
            </form> 
                <button onClick={toggleEditing}>취소</button> 
                </>
                ) : (
                <>
                <h4>{sweetObj.text}</h4>
                {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Sweet 삭제</button>
                        <button onClick={toggleEditing}>Sweet 수정</button>
                    </>
                )}
                </>
            )}
    </div>
    )
};


export default Sweet;
