/* eslint-disable max-len */
import './styles.scss';
import { NavLink, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { loadMessages, typeMessage, submitMessage } from '../../actions/conversation';
// import loader from '../../assets/img/icons/loader.gif';

export default function PrivateConversation() {
  const messageListRef = useRef();
  const { messagesList } = useSelector((state) => state.conversation);
  const { messageInput } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const location = useLocation();

  function getInterlocutor() {
    if (messagesList[0].userSender.id === user.id) return messagesList[0].userRecipient;
    return messagesList[0].userSender;
  }

  function submitMsg(e) {
    e.preventDefault();
    const message = {
      title: '',
      content: messageInput,
      userSender: user.id,
      userRecipient: getInterlocutor().id,
    };
    if (messageInput.trim() !== '') {
      dispatch(submitMessage(message));
    }
  }

  useEffect(() => {
    dispatch(loadMessages(location.pathname.split('/').pop()));
  }, []);

  useEffect(() => {
    const totalHeight = messageListRef.current.scrollHeight;

    // Scrolls the scrollbar at the bottom when there is a new message
    messageListRef.current.scrollTo({
      top: totalHeight,
      left: 0,
      behavior: 'smooth',
    });
  }, [messagesList]);

  return (
    <div className="message">
      <div className="message_header">
        <div className="message_header_button">
          <NavLink className="message_header_back" to="/conversation">
            <ArrowBackIcon />
            <p>Retour</p>
          </NavLink>
          <div className="message_header_title">
            <p>{ messagesList.length !== 0 && messagesList[0].conversation ? messagesList[0].conversation.title : ''}</p>
          </div>
          <div className="message_header_user">
            <p>{messagesList.length !== 0 && getInterlocutor().firstname}</p>
          </div>
        </div>
      </div>
      <div className="message_conversation" ref={messageListRef}>
        {/* slice() creates a copy of the list of messages before reversing it with reverse() */}
        { messagesList.length !== 0 && messagesList.map((message, index) => {
          const currentUserIsSender = message.userSender.id === user.id;
          const previousMessage = messagesList[index + 1];
          const previousMessageIsFromSameUser = previousMessage && previousMessage.userSender.id === message.userSender.id;
          return (
            <div
              key={message.id}
              className={`message_conversation_talk ${currentUserIsSender ? 'message_conversation_talk--right' : 'message_conversation_talk--left'}`}
            >
              {!previousMessageIsFromSameUser && (
                <div>
                  <img src={message.userSender.picture} alt="profil" />
                  <div className="message_conversation_talk_username">{message.userSender.firstname}</div>
                </div>
              )}
              <p>{message.content}</p>
            </div>
          );
        })}
      </div>
      {/*  <div className="message_conversation_loader">
        <img src={loader} alt="Loading..." />
      </div> */}
      <form
        className="message_form"
        onSubmit={(e) => submitMsg(e)}
      >
        <div className="message_form_container">
          <div className="message_form_container_text">
            <input
              placeholder="Entrez votre message"
              value={messageInput}
              onChange={(e) => dispatch(typeMessage(e.target.value))}
            />
          </div>
          <button
            type="submit"
            className="message_form_container_button"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
