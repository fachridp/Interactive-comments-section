import { useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"

import profilePictureCurrentUser from "../../public/assets/images/image-juliusomo.png";

// eslint-disable-next-line react/prop-types
export default function ReplyCommentBox({ username, setDatas, currentDate, classClone }) {
 const textareaRef = useRef(null);
 const replyButtonRef = useRef(null);

 const putTheCursorAtTheEnd = () => {
  textareaRef.current.focus();
  textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
 }

 const sendReply = () => {
  const getTextareaValue = textareaRef.current.value;
  // eslint-disable-next-line react/prop-types
  const contentReply = getTextareaValue.slice(username.length + 2);

  let newReply = {
   id: uuidv4(),
   content: contentReply,
   score: 0,
   replyingTo: username,
   statusUser: "you",
   createdAt: currentDate,
   actions: [
    {
     id: uuidv4(),
     type: "Delete",
     icon: "assets/icons/icon-delete.svg",
     textColor: "text-soft-red"
    },
    {
     id: uuidv4(),
     type: "Edit",
     icon: "assets/icons/icon-edit.svg",
     textColor: "text-moderate-blue"
    }
   ],
   replyStatus: false,
   repliesChild: [],
   user: {
    image: {
     png: "assets/images/image-juliusomo.png",
     webp: "assets/images/image-juliusomo.webp"
    },
    username: "juliusomo"
   }
  }

  setDatas(oldSetDatas => {
   const updatedDatas = {
    ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
     if (comment.user.username === username) {
      return {
       ...comment, replies: [...comment.replies,
        newReply
       ]
      }
     }
     return comment;
    })
   }

   localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

   return updatedDatas;
  })

  setDatas(oldSetDatas => {
   const updatedDatas = {
    ...oldSetDatas, comments: oldSetDatas.comments.map(comment => {
     return {
      ...comment, replies: comment.replies.map(reply => {
       if (reply.user.username === username) {
        return {
         ...reply, repliesChild: [...reply.repliesChild, newReply]
        }
       }
       return reply;
      })
     }
    })
   }
   localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

   return updatedDatas;
  })
 }

 const cancelReply = (e) => {
  const targetToRemove = e.target.parentNode.parentNode.parentNode;
  targetToRemove.remove();
 }

 useEffect(() => {
  putTheCursorAtTheEnd();

 }, [])

 return (
  <>
   <div className={`relative flex flex-col gap-3 p-4 mt-3 bg-white rounded-md box-reply animate_animated animate__bounceIn ${classClone ? classClone[0] : ''}`}>
    <textarea ref={textareaRef} name={uuidv4()} id={uuidv4()} placeholder="Add a comment..." className="px-3 py-2 border-[1px] rounded-md border-light-grayish-blue text-grayish-blue focus:outline-none focus:ring-1 focus:ring-dark-blue focus:cursor-pointer" defaultValue={`@${username}, `}>
    </textarea>

    <div className="flex flex-wrap items-center justify-between">
     <img className="w-8" src={profilePictureCurrentUser} alt="Profile Picture User" />

     <div className="flex flex-wrap items-center gap-3">
      <button onClick={cancelReply} className="p-2 px-4 text-sm font-medium text-white uppercase duration-75 ease-in-out rounded-md bg-soft-red hover:opacity-45">
       Cancel
      </button>

      <button ref={replyButtonRef} onClick={() => sendReply(replyButtonRef.current)} className="p-2 px-4 text-sm font-medium text-white uppercase duration-75 ease-in-out rounded-md hover:opacity-45 bg-moderate-blue">
       Reply
      </button>
     </div>

    </div>
   </div>
  </>
 )
}
