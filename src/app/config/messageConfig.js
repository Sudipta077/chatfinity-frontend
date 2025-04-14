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

export const getsender=(item,loggedUser)=>{

    if(item.isGroupChat){
       
        return null;

    }

    else if (item.users) {
        const filteredSender = item.users.find((user) => user._id !== loggedUser.id);
        const filter= {
            user:filteredSender,
            salt: item.salt
        }
        return filter;
        // setSender(filteredSender);
    }
}