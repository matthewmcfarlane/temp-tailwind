import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import NewBugForm from "../NewBugForm";
import BugRows from "../BugRows";
import { filterByPriority, filterByActive, sortByDate, sortByPriority  } from "../../../services/SortAndFilter";
import { deleteBug, patchBug } from "../../../services/BugsService";

const BugTable = () => {
  const { user } = useAuth0();
  const [allBugs, setAllBugs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bugsToRender, setBugsToRender] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("clear");
  const [activeFilter, setActiveFilter] = useState("clear");
  const [dateSort, setDateSort] = useState("clear");
  const [prioritySort, setPrioritySort] = useState("clear");
  const [isAddingBug, setIsAddingBug] = useState(false)

  const [checked, setChecked] = useState(
    new Array({allBugs}.length).fill(false)
  );

  const onBugAddition = (newBug) => {
    //Generate date to display
    var today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth()).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = yyyy + mm + dd;

    //Fill in missing fields to allow render
    newBug['dateReported'] = today;
    newBug['assignees'] = [];
    newBug['active'] = true;

    const updatedBugs = [...allBugs, newBug];
    setAllBugs(updatedBugs);
  }

  useEffect(() => {
    getAllBugs();
  }, []);

  useEffect(() => {
    setBugsToRender(allBugs);
    setActiveFilter("clear");
    setPriorityFilter("clear");
  }, [allBugs]);

  const getAllBugs = () => {
    fetch("http://localhost:9090/bugs")
    .then((result) => result.json())
    .then((data) => {
      setAllBugs(data);
      setBugsToRender(data);
    });
  };

  const handleEditingClick = () => {
    if (isEditing == false) {
      setIsEditing(true)
    } else {
      setIsEditing(false);
    }
  }

  const handleOnChange = (position) => {
    const updatedCheckState = checked.map((item, index) =>
    index === position ? !item : item
    );

    setChecked(updatedCheckState);
  };

  const handleToggleActive = (event) => {
    event.preventDefault();

    //Find toggled bug and flip value
    const bugIndex = event.target.value;
    const toggledBug = allBugs[bugIndex];
    toggledBug.active = !toggledBug.active;

    const updatedBugsList = [...allBugs];
    updatedBugsList[bugIndex] = toggledBug;
    patchBug(toggledBug)
    .then(setAllBugs(updatedBugsList));
  }

  const assigneeElements = (bug) => {
    return bug.assignees.map((assignee, index) => {
      return(
        <div key={index}>
          <div className="text-sm font-medium text-gray-900">
            {assignee.name}
          </div>
          <div className="text-sm text-gray-500">
            {assignee.email}
          </div>
        </div>
      )
    })
  }

  const removeBug = (id) => {
    const temp = allBugs.map(s => s);
    const indexToDel = temp.map(s => s.id).indexOf(id);
    
    temp.splice(indexToDel, 1);
    setAllBugs(temp);
    deleteBug(id);
  }

  const toggleAdding = () => {
    isAddingBug == false ? setIsAddingBug(true) : setIsAddingBug(false)
  }

  const onFilterByPriority = (event) => {
    setPriorityFilter(event.target.value);
    setActiveFilter("clear");
    setDateSort("clear");
    setPrioritySort("clear");
    if (event.target.value === "clear"){
      setBugsToRender(allBugs);
    }
    else{
      setBugsToRender(filterByPriority(allBugs, event.target.value));
    }
  } 

  const onFilterByActive = (event) => {
    const selectedOption = event.target.value;
    setActiveFilter(selectedOption);
    setPriorityFilter("clear");
    setDateSort("clear");
    setPrioritySort("clear");
    if (selectedOption === "clear"){
      setBugsToRender(allBugs);
    }
    else{
      setBugsToRender(filterByActive(allBugs, (selectedOption === "true")));
    }
  }

  const onSortByDate = (event) => {
    setPrioritySort("clear");
    setDateSort(event.target.value);
    setBugsToRender(sortByDate(bugsToRender, (event.target.value === "newestFirst")));
  }

  const onSortByPriority = (event) => {
    setDateSort("clear");
    setPrioritySort(event.target.value);
    setBugsToRender(sortByPriority(bugsToRender, (event.target.value === "highestFirst")));
  }

  return (



    <div className='dark:bg-black pl-52 pt-24 pb-8 pr-8 w-full h-full min-h-screen shadow-lg flex flex-row'>

    <div className='bg-red-400 w-full h-full min-h-screen shadow-lg flex-1 overflow-hidden' >



    <div className={`${isAddingBug == true ? 'backdrop-blur-xl' : ''}`}>
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="ml-2 mt-2 mb-2">
          <select value={priorityFilter} onChange={onFilterByPriority}>
            <option value="clear" disabled hidden>
              filter by priority...
            </option>
            <option value="clear">show all</option>
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>
          <select value={activeFilter} onChange={onFilterByActive}>
            <option value="clear" disabled hidden>
              filter by status...
            </option>
            <option value="clear">show all</option>
            <option value="true">open</option>
            <option value="false">closed</option>
          </select>
          <select value={dateSort} onChange={onSortByDate}>
            <option value="clear" disabled hidden>
              sort by date...
            </option>
            <option value="newestFirst">newest first</option>
            <option value="oldestFirst">oldest first</option>
          </select>
          <select value={prioritySort} onChange={onSortByPriority}>
            <option value="clear" disabled hidden>
              sort by priority...
            </option>
            <option value="highestFirst">highest first</option>
            <option value="lowestFirst">lowest first</option>
          </select>
          {isEditing == true ? 
          <button onClick={() => removeBug()}>Remove Bugs</button>
          : isEditing == false}
        </div>
        <div>
          <button onClick={() => handleEditingClick()} className="mt-2 mb-2 bg-orange-400 rounded hover:bg-orange-600 p-2 ">
            Edit
          </button>
        </div>
        <div>
          <button onClick={() => {toggleAdding()}} className="bg-orange-400 rounded mt-2 mb-2 ml-1 hover:bg-orange-600 p-2 w-10">+</button>
        </div>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assignees
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>

                <BugRows
                bugsToRender={bugsToRender}
                isEditing={isEditing}
                checked={checked}
                handleOnChange={handleOnChange}
                assigneeElements={assigneeElements}
                handleToggleActive={handleToggleActive}
                removeBug={removeBug}
                />
              </thead>
              <tbody className="bg-white divide-y divide-gray-200"></tbody>
            </table>
          </div>
        </div>
      </div>
      { isAddingBug == true ?
      <div className="flex absolute bg-orange-300 shadow-2xl p-20 rounded-xl border-8 border-orange-400 align-middle ml-80 mt-20">
      <NewBugForm setIsAddingBug={setIsAddingBug} onBugAddition={onBugAddition}/>
      </div>
      : isAddingBug == false
      }
    </div>
    </div>
  

   
  

    </div>


  

      
    </div>
   
  );
};

export default BugTable;
