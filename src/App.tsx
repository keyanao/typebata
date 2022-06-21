import React, { Dispatch, useEffect, useState } from "react";
import './index.css';
import { db } from './firebase';
import {getDocs} from "firebase/firestore";
import { doc, addDoc, deleteDoc, collection} from "firebase/firestore";

enum Gender {
    men = 1,
    women = 2,
}

// interface Props {
//     name: "taro" | "jiro" | "saburo";
//     age: 20 | 40;
//     gender: Gender;
// }


function InputInfo(props:{setData: Dispatch<string[][]>}){ //入力
    const [name, setName] = useState("");//名前
    const [age, setAge] = useState("");//年齢
    const [gender, setGender] = useState("")//性別
    const [weight, setWeight] = useState("")//体重
   

    function CreateUser(name:string, age:string, gender:string, setName:(name:string) => void, setAge:(age:string)=>void, setGender:(gender:string)=>void){ //送る
        addDoc(collection(db, "userInfo"),{//オブジェクトにしてデータベースに送る
            name: name,
            age: age,
            gender: gender,
            weight: weight,
        })
        SemiVeiw(props.setData);
        setName("")//初期化
        setAge("")
        setGender("")
        setWeight("")
    }

    const genderJudge = (gender: Gender)=>{
        switch(gender){
            case 1:
                setGender("男")
                setWeight("")
                break;
            case 2:
                setGender("女")
                setWeight("リンゴ３つ分")
                break;
        }
    }

    return(
        <>
        <p>個人情報</p>
        <input type="text" id="name" value={name}   placeholder='名前' onChange={(e)=> setName(e.target.value)}/> {/* //onChange以降でvalueの値変更 */}
        <input type="text" id="age" value={age}  placeholder='年齢' onChange={(e)=> setAge(e.target.value)}/>
        <button onClick={() => genderJudge(Gender.men)}>男</button>
        <button onClick={() =>genderJudge(Gender.women)}>女</button>
        <button onClick={() => CreateUser(name, age, gender, setName, setAge, setGender)}>new</button>
        {gender==="男" ? <input type="text" id="weight" value={weight}  placeholder='体重(kg)' onChange={(e)=> setWeight(e.target.value)}/> : <></>}
        </>
    )
}


async function DeleteUser(index:number, data:string[][], setdata: (data:string[][])=>void){
    await deleteDoc(doc(db, "userInfo", data[index][4]))//4はid番号
    setdata(data.filter((_,i) => i !== index))
}

async function SemiVeiw(setData:(data:string[][])=>void){//データ受け取り
    const querySnapshot = await getDocs(collection(db, "userInfo"));
    const n:string[][]=[]
    querySnapshot.forEach((doc)=>{
        n.push(
            [doc.data().name, doc.data().age, doc.data().gender, doc.data().weight, doc.id]//オブジェクト
        );
    });
    setData(n)
}


function VeiwUserAccount(props: {
    data: string[][]
    setData: Dispatch<string[][]>
}){ //データ表示
    return (
        <>
            <p>情報一覧</p>
            <table style={{"borderWidth":"1px", 'borderColor':"block", 'borderStyle':'solid'}} width="500">
                <tbody>
                <tr>
                    <td>名前</td>
                    <td>年齢（歳）</td>
                    <td>性別</td>
                    <td>体重（kg）</td>
                </tr>
                <DataUpdate data = {props.data} setData= {props.setData}/>
                </tbody>
            </table>
        </>
    )
}


function DataUpdate(props:{
    data: string[][]
    setData: Dispatch<string[][]>
}){
    return(
        <>
            {props.data.map((d, i)=>
                    <tr key={`account_${i}`}>
                        <td>{d[0]}</td>
                        <td>{d[1]}</td>
                        <td>{d[2]}</td>
                        <td>{d[3]}</td>
                        <td><button onClick={()=> DeleteUser(i, props.data, props.setData)}>delete</button></td>
                    </tr>
            )}
        </>
    )
}



export default function Personal(){
    const [data, setData] = useState<string[][]>([])
    useEffect(() => {SemiVeiw(setData)} ,[]);
    return(
        <div>
            <InputInfo setData={setData}/>
            <VeiwUserAccount data={data} setData={setData} />    
        </div>
    )
}

