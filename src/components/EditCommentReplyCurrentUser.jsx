import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line react/prop-types
export default function EditCommentReplyCurrentUser({ defaultValue }) {
 const textareaRef = useRef(null);

 const putTheCursorAtTheEnd = () => {
  textareaRef.current.focus();
  textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
 }

 useEffect(() => {
  putTheCursorAtTheEnd();
 })

 return (
  <>
   <div className="rounded-md">
    <textarea ref={textareaRef} name={uuidv4()} id={uuidv4()} placeholder="Add a comment..." className="w-full px-3 py-2 border-[1px] rounded-md border-light-grayish-blue text-grayish-blue focus:outline-none focus:ring-1 focus:ring-dark-blue focus:cursor-pointer" rows={5} defaultValue={`${defaultValue}`}></textarea>
   </div>
  </>
 )
}
