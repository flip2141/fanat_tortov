WorkArray = localStorage["32"].split("\n")

var ADDRESS = "";var POSTCODE = "";var HOURS = "";var TEL = "";var EMAIL = "";var CITY = "";var FAX = "";var LINK = "";var DESC = "";var OPER = "";var NAME = "";
var CID = "0";var CityNoS = "";var StateName = "";var LatestId = "";var Lat = "";var Lng = "";

//создать

CurBranchId = 1;
BranchLen = 11
DelaY = 20000


cat = "239"
countr = "br"
Country = "Brasill"
MainNameForCat = "Orbotom  "
IfStaNew = ", "

//функции предподготовки

function GetNewInfo()
{
	ConSist = JSON.parse(WorkArray[CurBranchId-1])
	ADDRESS = ConSist["indir"]
	POSTCODE = ConSist["cab"]

	contacts = []
	if (ConSist["tel1_filiali"]!="")
	{
		contacts.push("Tel.: "+ConSist["tel1_filiali"])
	}
	if (ConSist["tel2_filiali"]!="")
	{
		contacts.push("Tel.2: "+ConSist["tel2_filiali"])
	}
	if (ConSist["fx_private"]!="")
	{
		contacts.push("Fax: "+ConSist["fx_private"])
	}

	contacts.push("")
	contacts.push("")
	contacts.push("")

	TEL = contacts[0]
	EMAIL = contacts[1]
	FAX = contacts[2]
	
	CITY = ConSist["loc"]
	LINK = "https://bnl.it/"
	
	DESC =  "N° ATM	" +ConSist["atm_est"]+" Si\r\n"+
			"Servizio di cassa Si\r\n"+
			"Cassa Continua	Si"+
			"Cassette di sicurezza	Si\r\n"+
			"Cambio Valuta	Si";
	rand = Math.floor(Math.random()*4);

	if (rand!=1)
	{
	OPER = "1-07:00-19:00-0-00:00-00:00\r\n"+
		   "1-07:00-19:00-0-00:00-00:00\r\n"+
		   "1-07:00-19:00-0-00:00-00:00\r\n"+
		   "1-07:00-19:00-0-00:00-00:00\r\n"+
		   "1-07:00-19:00-0-00:00-00:00\r\n"+
		   "0-00:00-00:00-0-00:00-00:00\r\n"+
		   "0-00:00-00:00-0-00:00-00:00\r\n";
	}
	else
	{
	OPER = "1-09:00-17:00-0-00:00-00:00\r\n"+
		   "1-09:00-17:00-0-00:00-00:00\r\n"+
		   "1-09:00-17:00-0-00:00-00:00\r\n"+
		   "1-09:00-17:00-0-00:00-00:00\r\n"+
		   "1-09:00-17:00-0-00:00-00:00\r\n"+
		   "0-00:00-00:00-0-00:00-00:00\r\n"+
		   "0-00:00-00:00-0-00:00-00:00\r\n";
	}

	NAME = ConSist["d_filiali"]

	Lat = ConSist["lat"];
	Lng = ConSist["lng"];

}


function StartBranch()
{
	GetNewInfo()
	CID = "0"; 
	CityNoS = CITY
	StateId = ""
	StateName = ""
	LatestId = "";
	//Lat = "";Lng = "";
	

	GetID();
}


function GetID()
{
	$.get("index.php?p="+countr+"&menu=2&tab=0&top="+cat,GetLatestId)	
}

function GetLatestId(data)
{
	g = data.match(/b\d{5,6}/gi)
	LatestId=g[g.length-1].slice(1)
	//GetMap();
	PostCity()
}


function AfterNewCity(data)
{
	$.post("inc/action_search.php",{p:countr,t:"0",q:CityNoS},SecondFindCity);
}

function PostCity(data)
{
	$.post("inc/action_search.php",{p:countr,t:"0",q:CityNoS},FindCityID);	
}

function FindCityID(data){
	g = JSON.parse(data)
	var numb = JSON.stringify(g).match(/\d+/gi);

	if (!(numb==undefined)){
		for (var i = 0;i<numb.length;i++)
		{
			if (g[numb[i]].toLowerCase()===CITY.toLowerCase() || g[numb[i]].toLowerCase()===(CityNoS+IfStaNew).toLowerCase())
			{
				CID=numb[i]
			}
		}
	}

	if (CID!="0" && CID!=undefined) Post1()
	else if (CID=="0")
	{
		$.get("index.php?p="+countr+"&menu=2&tab=2&cit=new",AddCity)				
	}
}

function SecondFindCity(data){
	g = JSON.parse(data)
	var numb = JSON.stringify(g).match(/\d+/gi);

	if (!(numb==undefined)){
		for (var i = 0;i<numb.length;i++)
		{
			if (g[numb[i]].toLowerCase()===CITY.toLowerCase())
			{
				CID=numb[i]
			}
		}
	}

	if (CID!="0" && CID!=undefined) Post1()
	else if (CID=="0")
	{
		localStorage.setItem(CITY,"Not Found")	
		FinalyRename()
	}
}

function AddCity(data)									//Иногда над state:"0",
{


	$.post("index.php?p="+countr+"&menu=2&tab=2&cit=new",{name:CityNoS,post:"",Submit_ct:""},AfterNewCity);
}

function GetMap()
{
	Gurl=ADDRESS+"+"+CITY+"+"+Country
	$.get("http://maps.googleapis.com/maps/api/geocode/json?address="+Gurl,MapView)
}

function MapView(data)
{
	try
	{
		g = JSON.parse(JSON.stringify(data.results))[0].geometry.viewport.northeast
		Lat = g.lat;
		Lng = g.lng;
	}
	catch (err)
	{
		Lat = "";
		Lng = "";
	}
    PostCity()
}


function Post1()
{
	$.post("inc/copy.php",{p:countr,t:LatestId},Post2)
}

function Post2(data)
{	
	var value = {}

	value["bid"] = LatestId;
	value["cid"] = CID;
	value["add"] = ADDRESS;
	value["post"] = POSTCODE;
	value["link"] = LINK
	value["lat"] = Lat;
	value["lng"] = Lng;
	value["zoom"] = "16"

	$.post("inc/save_copy.php",{p:countr,val:value},Post3)
}

function Post3(data)
{
	g = data.slice(2,6)
	try 
	{
		console.log(JSON.parse(data))
	}
	catch(err)
	{}
	if (g[1]=="r")
	{
		FinalyRename()
	}
	else
	{	
		$.get("index.php?p="+countr+"&menu=2&tab=0&top="+cat,GetLatestIdBranch)
	}
}

function GetLatestIdBranch(data)
{
	g = data.match(/b\d{5}/gi)

	LatestId=g[g.length-1].slice(1)
	
	var value={};
	value['name']=NAME
	value['add']=ADDRESS;
	value['post']=POSTCODE;
	value['oper']=OPER
	value['desc']=DESC
	value['link']=LINK
	value['t0']=TEL;
	value['t1']=EMAIL;
	value['t2']=FAX;
	value['t3']="";
	$.post("inc/action_branch2.php",{p:countr,bid:LatestId,val:value},FinalyRename)
}


function FinalyRename(data)
{
	document.title=CurBranchId;
	localStorage.setItem(MainNameForCat.slice(0,-2),CurBranchId)
	
	CurBranchId+=1 
	if (CurBranchId<WorkArray.length) {}
	setTimeout(StartBranch,DelaY)
}


function ReplaceXeRbNbIO(stri)
{
	for (var i=0;i<stri.length;i++)
	{
		str = stri[i];
		str=str.replace(/[áã]/gi,"a")
		str=str.replace(/[óô]/gi,"o")
		str=str.replace(/[êé]/gi,"e")
        str=str.replace(/[ç]/gi,"c")
        str=str.replace(/[ú]/gi,"u")
        str=str.replace(/[î]/gi,"i")
		stri[i] = str
	}
    return stri
}}}
