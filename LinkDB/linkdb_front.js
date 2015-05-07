function removeLink(elem)
{ 

 var toRemove = elem.parentNode.previousSibling;
 var rLink = toRemove.childNodes[0].href;
 if(rLink.substring(0,22) == "http://localhost:8000/")
{
 rLink = rLink.substring(22, rLink.length);
}
 var rNickname =  toRemove.childNodes[0].textContent;

 var url = "contentRemoved?link="+ rLink;
 url+= "&nickname=" + rNickname;

 var tRow = elem.parentNode.parentNode;
 tRow.remove();

 var link_sender = new XMLHttpRequest();
 link_sender.open("get", url);
 link_sender.send();

}

function syncContent()
{
 var link_receiver = new XMLHttpRequest();
 link_receiver.onload = linkListener;
 link_receiver.open("get", "updateContent");
 link_receiver.send();
}

function linkListener()
{
 var linkData = JSON.parse(this.responseText);
 var linkStack = linkData.split("%");
 var myTable = document.getElementById("myTable");
 myTable.innerHTML = "";

 for(var i = 0; i < linkStack.length -1; i++)
{
  var tData = linkStack[i].split("&");
  var actData = "<tr><td><a href='"+ tData[0]+ "'>" + tData[1] +"</a></td><td><button onCLick='removeLink(this)'>Delete</button></td></tr>";
  myTable.innerHTML += actData;
}
 
}

function addContent()
{
 var link = document.getElementById("linkName").value;
 var nickName = document.getElementById("nickName").value;

 var url = "contentAdded?link="+ link;
 url+= "&nickname=" + nickName;

 var link_sender = new XMLHttpRequest();
 link_sender.open("get", url);
 link_sender.send();

}

function startTime(){
 window.setInterval(syncContent, 1000);
 syncContent();
}

