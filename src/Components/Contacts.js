import React, { useState, useRef, useEffect, useReducer } from "react";

  function contactReducer(state, action){
    switch(action.type){
        case "SET_CONTACTS":
           return action.contacts;
        case "ADD": 
           return [action.contact, ...state];
        case "REMOVE":
           return state.filter((contact, index)=> index !== action.index);
        case "UPDATE":
           return state.map((contact, index) =>
           index === action.index ? action.updatedContact : contact
      );
        default:
            return [];
    }
  }

function Contacts(){

   
    const [formData, setFormdata] = useState({name:'', phone: ''});

    const [contacts, dispatch]  = useReducer(contactReducer, []);
    const contactRef = useRef(null);


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://jsonplaceholder.typicode.com/users");
            const data = await response.json();
            dispatch({ type: "SET_CONTACTS", contacts: data });
        
        };
    
        fetchData();
      }, []);
    

    useEffect(() => {
        contactRef.current.focus();
    }, [])

    useEffect(() => {
        if(contacts.length && contacts[0].name){
            document.title = contacts[0].name;
        }else{
            document.title="No contact added!"
        }
    }, [contacts])

   

    function handleSubmit(e){
        e.preventDefault();

        // setContacts([{name: formData.name, phone: formData.phone},...contacts]);
        dispatch({type: "ADD", contact: {name: formData.name, phone: formData.phone}});
        setFormdata({name: "", phone: ""})
        console.log(contacts);

        contactRef.current.focus();

    }

    function removeContact(i){
        // setContacts(contacts.filter((blog, index)=> i !== index))
        dispatch({type: "REMOVE", index: i});
    }

    function updateContact(i, updatedContact) {
        dispatch({ type: "UPDATE", index: i, updatedContact });
      }
    

  

    return(
        <>
        <h1 className="contact-title">Add Contact!</h1>
        <div className="contact-form" >
            <form onSubmit={handleSubmit}>
                <Row label="Name/Email">
                    <input className="input" placeholder="Enter Name or Email Id"
                    value={formData.name} required 
                    ref = {contactRef}
                    onChange={(e)=> setFormdata({name: e.target.value, phone: formData.phone})}/>
                </Row>

                <Row label="Phone">
                    <input type="number" className="input" placeholder="Enter Mobile number" 
                    value={formData.phone} required
                    onChange={(e)=> setFormdata({name: formData.name, phone: e.target.value})}/>

                </Row>

                <button className="btn">ADD </button>
            </form>
        </div>
       
        <hr />

       
        <h2>Contact List</h2>
        <div className="contacts-container">
                {contacts.map((contact, i)=> (
                    <div className="contacts" key={i}>
                        <h3>{contact.name} </h3>
                        
                        <h4>{contact.phone}</h4>

                   <div className="btn-container">
                     <div className="edit-btn">
                        <button
                            onClick={() => {
                            const updatedName = prompt("Enter updated name:");
                            const updatedPhone = prompt("Enter updated phone:");
                            updateContact(i, { name: updatedName, phone: updatedPhone });
                            }}
                           
                            className="btn edit"
                        >
                            Edit
                        </button>
                        </div>
                        <div className="delete-btn">
                        
                            <button onClick={() => removeContact(i)} className="btn remove">
                                Delete
                            </button>
                        </div>
                        </div>
                    </div>
                ))}
        </div>
       
        
        </>
    )
}


function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}


export default Contacts;