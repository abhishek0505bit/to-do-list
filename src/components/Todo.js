import React, { useState, useEffect } from 'react'
import "./style.css"


//this function is to retreive the data from local storage so that after refresh the content is not removed from the page
const getLocalData = () =>{

    const lists = localStorage.getItem("myTodoList")//this will get all the values from the key : myTodoList

    if(lists){
        return JSON.parse(lists)//list we would be getting in the form of string but we want list here, so converting string into array using parse
    }
    else{
        return []// if there is no element in the array return empty array
    }
}


//we have added classes in the elements to give apply the css to these elements 
const Todo = () => {

    //this use State is used to set and track the input text block 
    const [inputData , setInputData] = useState("")


    const [ items, setItems ] = useState( getLocalData() )//the initial value of items = [] we're getting from getLocalData function
    // in the items array, elements are added when we click on the add button 


    // this is EditItem state will store the id of that item whose edit button is clicked
    const [isEditItem, setIsEditItem ] = useState("")


    // this state is used to toggle button(from plus to edit icon) on input field when user  clicks on the edit button of the item 
    const [toggleButton, setToggleButton] = useState(false)


    // this is addItem() function which will add the item in 'items' array
    // items = current  state variable which will track the items array
    const addItem = () => {
        // if input data is empty, set alert = please fill the field
        if(!inputData){
            alert(" please fill the field ")
        }// else items = [ previous data + current data]
        // and set the input field = empty


        // if input data is not empty and toggle button = true that means user clicked  on the edit button  
        // then we'll setItems() i.e,set the items because anything done on the items list is only shown in the page
        // map will return list of objects at the end 
        // map will iterate on each object of the list to check whether curEle.id === isEditItem and return an object everytime based on the condition until all the objects of array are iterated
        else if(inputData && toggleButton){
            setItems(
                items.map((curEle) => {
                    if(curEle.id === isEditItem)
                    {
                        // if match successful then change the name in the already created object, don't make a new object
                        return{...items, name : inputData}
                    }
                    // if not matches, that means this is not that object in the already created list, so return it without any changes 
                    return(curEle)
                })
            )


            //when user has edited the item, 1) setInput box = empty, 2) set id of the selected item = empty, 3) set the toggle button false which will change the icon from edit to plus(+) again 
                setInputData("")
                setIsEditItem("")
                setToggleButton(false)
        }

        else{
            //new Data = { id : "120206589223" , name : "data input by the user"}
            const newData = {
                id : new Date().getTime().toString(),// date().getTime() will always give a unique value
                name : inputData// data entered by the user after clicking on add button
            }
            setItems([...items, newData])//now items = array of objects{id : "16194948" , name : "something"}
            setInputData("")//after clicking on add button , it will remove the text from the input field
        }      
    }// add item close (X)


        // edit Item function : which will edit the item in the list
        // this function  will be called when  someone click on the edit button of the item
        // for finding the item via id , we have find() function in javascript
        // find function will iterate on each item in the list, and we'll find that item whose Id === id passed by the user
        // find method is also  same as map and filter method but unlike map and filter and map method, it returns a single value
        const editItem = (curId) => {
            const item_to_edit = items.find((curEle) => {
                return curEle.id ===curId
            })

            setInputData(item_to_edit.name)// this will show that item name on the input field whose edit button is clicked 

            setIsEditItem(curId)// isEditItem will track the id of that item whose edit button is clicked 

            setToggleButton(true)// this will change the state of toggle button from false to true

        }// editITem close (X)


        // Delete an item function
         // filter function iterates on each object of list, (here object: curEle , list: items i.e,array of objects)
        const deleteItem = (curId) => {
            // we are filtering the data of the items array
            // updated list will store those objects [whose ID != ID passed by the user ]
            // then the updated list will have the objects except the object whose id is passed
            // and finally we will set the items list = updatedList       
            const updatedList= items.filter((curEle)=>
            {
                return curEle.id!==curId// return only those objects whose id != curId
            })
            setItems(updatedList)
        }// delete ITem close (X)


        // function : Remove all the items in the list
        const removeAll = () => {
            setItems([])// set the items array to empty
        }// removeAll close (X)


        // adding local storage
        // local storage works in the form of key : value pair and we can only pass string in that 
        // here key : myTodoList and value : items(which is not in the form of string)
        // to convert the items array into string we use JSON.stringify(items)
        useEffect(() => {
            localStorage.setItem("myTodoList",  JSON.stringify(items))
        }, [ items ])
        // we have added the items array dependency that means whenever we'll change the value of items then only our useEffect
        // will run


// whatever we write under return statement that thing is rendered on the webpage
  return (
   <>
    <div className="main-div">
        <div className="child-div">


            {/* this is todo logo */}
            <figure>
                <img src="./images/todo.svg" alt="todologo" />
                <figcaption> Add your list here </figcaption>
            </figure>


            {/* this is input box */}
            <div className="addItems">
                {/* use windows + . to add emoji in the placeholder  */}
                {/* value attribute will store the value of input given by the user on input box */}
                {/* on change attribute is the event which gets trigerred when user changes the value of input box */}
                {/* on click will run add Item function which will add an item in the array */}
                <input type="text"
                 placeholder='✍ Add Items' 
                 className='form-control' 
                 value={inputData} 
                 onChange={(e) => setInputData(e.target.value)}/>

                 {/* this icon will change from + to edit when user clicks on edit button */}
                 {/* if toggle button is true then icon will be edit button else icon will be add button */}
                 {toggleButton?<i className="fa fa-edit add-btn" onClick={() => addItem()}></i>:<i className="fa fa-plus add-btn" onClick={() => addItem()}></i>}
                
            </div>

            
            {/* show our Items */}
            {/* this will show the list when we clik on add btn */}
            {/* the items array which we have created, that we gonna show here with the help of map method  */}
            <div className="showItems">
                {items.map((curEle)=>{
                    return(
                        <>
                        <div className="eachItem" key={curEle.id}>
                            <h3> {curEle.name} </h3>
                            <div className="todo-btn">

                            <i className="far fa-edit add-btn" onClick={() => editItem(curEle.id)}></i>

                            {/* this trash button is used to delete the current item */}
                            <i className="far fa-trash-alt add-btn" onClick={() => deleteItem(curEle.id)}></i>
                            </div>
                        </div>
                        </>

                    )
                })}     
            </div>


            {/* Check List Button */}
            <div className="showItems">
                {/* data-sm-link-text is used to show 'remove all' when we hover on the checklist button */}
                <button className = "btn effect04" 
                data-sm-link-text = "Remove All" 
                onClick = { () => removeAll() }> 

                <span> CHECK LIST </span> 
                 </button>
            </div>


        </div>
    </div>
    </>
   
  )
}

export default Todo
