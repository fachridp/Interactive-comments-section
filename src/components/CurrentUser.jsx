/* eslint-disable react/prop-types */
import { useCallback, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import iconPlus from '../../public/assets/icons/icon-plus.svg'
import iconMinus from '../../public/assets/icons/icon-minus.svg'
import iconDelete from '../../public/assets/icons/icon-delete.svg'
import iconEdit from '../../public/assets/icons/icon-edit.svg'
import DeleteConfirmationBox from './DeleteConfirmationBox'

export default function CurrentUser({ datas, setDatas, currentDate }) {
 const [contentCurrentUser, setContentCurrentUser] = useState("");
 const [editingId, setEditingId] = useState(null);
 const [deletedTargetId, setDeletedTargetId] = useState(null);
 const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

 const textareaRef = useRef();
 const sendButtonRef = useRef();

 const currentUserPostingValue = ({ target: { value } }) =>
  setContentCurrentUser(value);

 const sendingNewComment = () => {
  const newComment = {
   id: uuidv4(),
   content: contentCurrentUser,
   score: 0,
   createAt: currentDate,
  }

  const { currentUser } = datas;
  const updatedCurrentUserContents = { ...currentUser, contents: [...currentUser.contents, newComment] };
  const updatedDatas = { ...datas, currentUser: updatedCurrentUserContents };
  setDatas(updatedDatas);
  localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));

  textareaRef.current.value = "";
 }

 const upVoteCommentCurrentUser = (e) => {
  const currentUserCommentId = e.target.dataset.id;

  const { currentUser } = datas;
  const updatedContents = currentUser.contents.map(content => {
   if (content.id === currentUserCommentId) {
    return { ...content, score: content.score + 1 };
   }
   return content;
  });

  const upVoteCurrentUser = { ...currentUser, contents: updatedContents };
  const updatedDatas = { ...datas, currentUser: upVoteCurrentUser };

  setDatas(updatedDatas);
  localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));
 }

 const downVoteCommentCurrentUser = (e) => {
  const currentUserCommentId = e.target.dataset.id;

  const { currentUser } = datas;
  const updatedContents = currentUser.contents.map(content => {
   if (content.id === currentUserCommentId) {
    return { ...content, score: content.score - 1 };
   }
   return content;
  });

  const downVoteCurrentUser = { ...currentUser, contents: updatedContents };
  const updatedDatas = { ...datas, currentUser: downVoteCurrentUser };

  setDatas(updatedDatas);
  localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));
 }

 const getEditCommentCurrentUserId = useCallback((id) => {
  setEditingId(id);
 }, [setEditingId]);

 const updateCommentCurrentUser = () => {
  const editResult = textareaRef.current.value;

  const { currentUser } = datas;
  const matchCurrentUserCommentId = { ...currentUser, contents: [...currentUser.contents.filter(contentId => contentId.id == editingId ? contentId.content = editResult : contentId)] }
  const updatedDatas = { ...datas, currentUser: matchCurrentUserCommentId }
  setDatas(updatedDatas)
  localStorage.setItem("updatedDatas", JSON.stringify(updatedDatas));
  setEditingId(null)
 }

 const cancelUpdateClicked = () => setEditingId(null);

 const deleteCommentCurrentUser = useCallback((e) => {
  setDeletedTargetId(e.target.dataset.id)
  setShowDeleteConfirmation(true)
 }, [setDeletedTargetId, setShowDeleteConfirmation])

 return (
  <>
   {/* the comment that currentUser make / send */}
   {datas.currentUser.contents.length > 0 && (
    <div className='space-y-5 max-w-[45.625rem] mx-auto'>
     {datas.currentUser.contents.map(currentUserContent => (
      <div key={uuidv4()} className="space-y-3 wrapper-replies" >
       <div className="relative flex flex-col-reverse gap-3 p-[1.2rem] bg-white rounded-md items-start mobile-xl:flex-row mobile-xl:gap-0 mobile-xl:-space-x-2">
        <div className="flex flex-wrap items-center justify-between w-full gap-3 mobile-xl:w-fit">
         {/* upvote, score and downvote */}
         <div className="text-moderate-blue font-medium fill-[#C5C6EF] bg-light-gray rounded-lg p-2 text-sm text-center flex justify-between w-[4.2rem] mobile-xl:flex-col mobile-xl:justify-center mobile-xl:items-center mobile-xl:basis-10 mobile-xl:py-5 mobile-xl:gap-3">
          <div className="svg-container place-content-center">
           <img onClick={upVoteCommentCurrentUser} data-id={currentUserContent.id} className="duration-[20ms] cursor-pointer ease-in-out" src={iconPlus} alt="Icon Plus" />
          </div>
          <p>{currentUserContent.score}</p>
          <div className="svg-container place-content-center">
           <img data-id={currentUserContent.id} onClick={downVoteCommentCurrentUser} className="duration-[20ms] ease-in-out cursor-pointer" src={iconMinus} alt="Icon Minus" />
          </div>
         </div>

         {/* button delete, button edit and button update */}
         <div className={`text-sm flex items-center gap-3 font-medium mobile-xl:h-fit flex-wrap mobile-xl:absolute mobile-xl:right-6 mobile-xl:top-6`}>
          {/* button delete comment */}
          <div className="flex items-center gap-2 duration-75 ease-in-out cursor-pointer text-soft-red hover:opacity-90">
           <img src={iconDelete} alt="Icon trash for delete" />
           <button data-id={currentUserContent.id} onClick={deleteCommentCurrentUser}>Delete</button>
          </div>
          {/* button edit comment */}
          <div data-id={currentUserContent.id} onClick={() => getEditCommentCurrentUserId(currentUserContent.id)} className="flex items-center gap-2 duration-75 ease-in-out cursor-pointer text-moderate-blue hover:opacity-90">
           <img data-id={currentUserContent.id} src={iconEdit} alt="Icon pencil for edit" />
           <button data-id={currentUserContent.id}>Edit</button>
          </div>
         </div>

         {/* button cancel update and update */}
         <div className={`${editingId == currentUserContent.id ? "flex items-center justify-end gap-3 mobile-xl:hidden" : "hidden"}`}>
          {/* button cancel update */}
          <button onClick={cancelUpdateClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-soft-red hover:opacity-90 hover:duration-75">Cancel</button>

          {/* button update */}
          <button onClick={updateCommentCurrentUser} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-moderate-blue hover:opacity-90 hover:duration-75">Update</button>
         </div>
        </div>

        {/* profile picture, date and the comment */}
        <div className="w-full space-y-2">
         {/* profile picture username and date */}
         <div className="flex flex-wrap items-center gap-3">
          <img className="w-8" src={datas.currentUser.image.webp} alt={`Profile Picture of ${datas.currentUser.username}`} />
          <h1 className="font-medium text-dark-blue">{datas.currentUser.username}</h1>
          <p className="px-2 py-[1px] text-sm text-white rounded-sm bg-moderate-blue">You</p>
          <p className='text-grayish-blue'>{currentUserContent.createAt}</p>
         </div>

         {/* the comment and edit comment textarea */}
         {editingId == currentUserContent.id ? (
          <>
           <textarea ref={textareaRef} name={uuidv4()} id={uuidv4()} defaultValue={currentUserContent.content} className="w-full px-3 py-2 border-[1px] rounded-md border-light-grayish-blue text-grayish-blue focus:outline-none focus:ring-1 focus:ring-dark-blue focus:cursor-pointer"></textarea>

           <div className='hidden mobile-xl:flex mobile-xl:justify-end mobile-xl:ml-auto mobile-xl:space-x-3'>
            {/* button cancel update */}
            <button onClick={cancelUpdateClicked} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-soft-red hover:opacity-90 hover:duration-75">Cancel</button>

            {/* button update */}
            <button onClick={updateCommentCurrentUser} className="right-0 px-3 py-2 text-xs font-medium text-white uppercase ease-in-out rounded-md bg-moderate-blue hover:opacity-90 hover:duration-75">Update</button>
           </div>
          </>
         ) : <p className='text-grayish-blue'>{currentUserContent.content}</p>}
        </div>
       </div>
      </div>
     ))}
    </div >

   )
   }

   {/* create new comment by currentUser */}
   <div className="flex flex-col mobile-xl:flex-row-reverse items-start justify-between w-full gap-3 p-4 bg-white rounded-md  max-w-[730px] mx-auto">
    <textarea onChange={currentUserPostingValue} rows={4} ref={textareaRef} name={uuidv4()} id={uuidv4()} placeholder="Add a comment..." className="order-2 px-3 py-2 border-[1px] rounded-md border-light-grayish-blue text-grayish-blue focus:outline-none focus:ring-1 focus:ring-dark-blue focus:cursor-pointer w-full">
    </textarea>

    <div className="flex flex-wrap items-center justify-between order-3 w-full mobile-xl:w-fit">
     <img className="w-12" src={datas.currentUser.image.webp} alt="Profile Picture User" />

     <div className="order-3 mobile-xl:order-1 mobile-xl:hidden">
      <button ref={sendButtonRef} onClick={() => sendingNewComment(sendButtonRef.current)} className="p-2 px-4 text-sm font-medium text-white uppercase duration-75 ease-in-out rounded-md hover:opacity-45 bg-moderate-blue">
       Send
      </button>
     </div>
    </div>

    <div className="order-3 hidden mobile-xl:block mobile-xl:order-1">
     <button ref={sendButtonRef} onClick={() => sendingNewComment(sendButtonRef.current)} className="p-2 px-4 text-sm font-medium text-white uppercase duration-75 ease-in-out rounded-md hover:opacity-45 bg-moderate-blue">
      Send
     </button>
    </div>
   </div>

   {showDeleteConfirmation ? <DeleteConfirmationBox showDeleteConfirmation={showDeleteConfirmation} setShowDeleteConfirmation={setShowDeleteConfirmation} deletedTargetId={deletedTargetId} datas={datas} setDatas={setDatas} /> : ""}
  </>
 )
}
