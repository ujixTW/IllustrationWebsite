import { useEffect } from "react";
import changeWebTitle from "../../utils/changeWebTitle";

function CreateArtwork(){
    useEffect(()=>{changeWebTitle("投稿 - ")},[])
    return<></>
}
export default CreateArtwork;