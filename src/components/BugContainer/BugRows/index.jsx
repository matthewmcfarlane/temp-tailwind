const BugRows = ({ bugsToRender, isEditing, checked, handleOnChange, assigneeElements, handleToggleActive, removeBug }) => {
    return bugsToRender.map((bug, index) => {
       let status = "Open";
       if (bug.active) {
         status = "Open";
       } else {
         status = "Closed";
       }
       return (
         <tr className="" key={index}>
           <td className="px-6 py-4 whitespace-nowrap">
             <div className="flex items-center">
               {isEditing == true ?
               <input id={`custom-checkbox-${index}`} className="mr-2" name={bug.name} value={bug.name} type="checkbox" checked={checked[index]} onChange={() => handleOnChange(index)}/>
               : isEditing == false} 
               <div className="ml-4">
                 {assigneeElements(bug)}
               </div>
             </div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
             <div className="text-sm text-gray-900">{bug.description}</div>
             <div className="text-sm text-gray-500">Optimization</div>
           </td>
           <td className="px-6 py-4 whitespace-nowrap">
             {bug.priority == "low" ? (
               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                 {" "}
                 {bug.priority}{" "}
               </span>
             ) : bug.priority == "medium" ? (
               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                 {" "}
                 {bug.priority}{" "}
               </span>
             ) : (
               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                 {" "}
                 {bug.priority}{" "}
               </span>
             )}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
             Admin
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
             <a href="#" className="text-indigo-600 hover:text-indigo-900">
             </a>
             {status}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
             {bug.reporter.name}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
             {bug.dateReported}
           </td>
           <td>
             <button value={index} onClick={handleToggleActive}>Toggle Active</button>
           </td>
           <td>
               <button value={index} onClick={() => removeBug(bug.id)} ><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
               </button>
           </td>
         </tr>
       );
     });
}

export default BugRows;