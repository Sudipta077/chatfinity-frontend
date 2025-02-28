export const isSameSender=(userEmail,senderEmail)=>{
    // console.log("userEmail--->",userEmail);
    // console.log("senderEmail--->",senderEmail);
    // console.log("result-->",userEmail==senderEmail);

    if(userEmail===senderEmail){
        return true;
    }
    else
        return false
}