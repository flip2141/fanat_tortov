var STATE; var MapRes; var CURBID; var CID; var CITY; var ADR;
var POST; var LINK; var LNG; var LAT; var NAME; var OPER; var DESC;
var TEL = ["","","",""]; var CURSTEP; var MapTypeDO;var CURBRANCH; var POST1STATE;
var POST2STATE; var Delay; var WorkArray; var CAT; var COUNTRY; var CNTR; var BRANCHLEN; var STATEARRAY;
var IfNOADD; var JSONCONT;

var COUNTER;

var LIMIT = 250;

function GetBID() //
{					//ищет -1
	CURBID = -1
	$.get("index.php?p="+CNTR+"&menu=2&tab=0&top="+CAT).done(function(data)
	{
		g = data.match(/b\d{5,6}/gi)
		CURBID=g[g.length-1].slice(1)
	})
}
function GetCID() //ищет -10
{					//не нашло -1
	CID = -10
	if (IfNOADD==2)
	{
		$.post("inc/action_search.php",{p:CNTR,t:"0",q:CITY+", "+STATE}).done(function(data)
		{
			if (data!="[]")
			{
				g = JSON.parse(data)
				for (i in g)
				{
					CID=i
				}
			}
			//
			if (CID==-10)
			{
				localStorage.setItem("LostBrach",localStorage["LostBrach"]+" "+CURBRANCH+"ND")
				CURSTEP=1
			}
		})
		
	}
	else if ((IfNOADD == 0) || (IfNOADD == 1))
	$.post("inc/action_search.php",{p:CNTR,t:"0",q:CITY+","}).done(function(data)
	{
		if (data!="[]")
		{
			g = JSON.parse(data)
			for (i in g)
			{
				if (ReplaceXeRbNbIO((CITY+", "+STATE).toLowerCase())==ReplaceXeRbNbIO(g[i]).toLowerCase())
				{
					CID=i
				}
			}
		}
		//
		if (CID==-10)
		{
			CID=-1
		}
		if (IfNOADD == 0)
		{
			IfNOADD = 1
		}
		if (IfNOADD == 1)
		{
			IfNOADD = 2
		}
	})
}

function ADCITY()
{
	CID = -10
	if (IfNOADD==2)
	{
		$.post("http://br.open-closed.org/admin2/index.php?p=br&menu=2&tab=2&cit=new",{state:"0",name:CITY+", "+STATE,post:"",Submit_ct:""}).done(function(data)
		{
			GetCID()
		})
	}
	else if (IfNOADD==1)
	$.post("http://br.open-closed.org/admin2/index.php?p=br&menu=2&tab=2&cit=new",{state:STATEARRAY.indexOf(STATE)+1,name:CITY,post:"",Submit_ct:""}).done(function(data)
	{
		GetCID()
	})
}

function WorkMap(adr,WYD) // Ищет -1
{
	MapRes = -1;
	MapTypeDO = WYD
	$.get("http://maps.googleapis.com/maps/api/geocode/json?"+adr+"&region=BR&language=pt").done(function(data)
	{
		MapRes = data;
		if (MapRes.status!="OK")
		{
			localStorage.setItem("LostBrach",localStorage["LostBrach"]+" "+CURBRANCH+"m1")
			CURSTEP=1
		}
		else
		switch (MapTypeDO)
		{
			case 1: //LAT LNG
			LAT = MapRes.results[0].geometry.location.lat
			LNG = MapRes.results[0].geometry.location.lng
			break; //PostCode
			case 2:
			g = MapRes.results[0].address_components
			POST = -1
			for (i in g)
			{
				if(g[i].types[0]=="postal_code")
				{
					POST = g[i].long_name
				}
			}
			if (POST==-1)
			{
				localStorage.setItem("LostBrach",localStorage["LostBrach"]+" "+CURBRANCH+"m2")
				CURSTEP=1
			}
			break;
			case 3://CITY
			g = MapRes.results[0].address_components
			CITY = -1
			for (i in g)
			{
				if((g[i].types[0]=="locality") || (g[i].types[0]=="administrative_area_level_2"))
				{
					CITY = g[i].long_name
				}
			}
			if (CITY==-1)
			{
				localStorage.setItem("LostBrach",localStorage["LostBrach"]+" "+CURBRANCH+"m3")
				CURSTEP=1
			}
			break;
			case 4://CITY+POST+STATE
			g = MapRes.results[0].address_components
			CITY = -1
			POST = -1
			STATE = ""
			for (i in g)
			{
				if((g[i].types[0]=="locality") || (g[i].types[0]=="administrative_area_level_2"))
				{
					CITY = g[i].long_name
				}
				if(g[i].types[0]=="postal_code")
				{
					POST = g[i].long_name
				}
				if(g[i].types[0]=="administrative_area_level_1")
				{
					STATE = g[i].short_name
				}
				
			}
			if ((CITY==-1) || POST==-1)
			{
				localStorage.setItem("LostBrach",localStorage["LostBrach"]+" "+CURBRANCH+"m23")
				CURSTEP=1
			}
			break;


		}
	})
}

function GetLatLng()
{
	LAT = -1
	WorkMap("address="+ADR+"+"+CITY+", "+STATE+"+"+COUNTRY,1)
}

function GetCityPostByLatLng()
{
    WorkMap("latlng="+LAT+","+LNG,4)
}

function GetCityNameByPost()
{
	CITY = -1
	WorkMap("address="+POST,3)
}

function POST1()
{
	var val1 = {}

	val1["bid"] = CURBID
	val1["cid"] = CID
	val1["add"] = ADR
	val1["post"] = POST
	val1["link"] = LINK
	val1["lat"] = LAT
	val1["lng"] = LNG;
	val1["zoom"] = "16"

	$.post("http://br.open-closed.org/admin2/inc/save_copy.php",
	{p:CNTR,val:val1}).done(function(data)
	{
		g = JSON.parse(data)
		if (g["mes"]==1)
		{
			console.log("+1 POST1")
			POST1STATE = 0
		}
		else
		{
			console.log("Double POST1")
			POST1STATE = 10
		}
	})
}

function POST2()
{
	var val2 = {}
    BID1 = CURBID
    
    val2["name"] = NAME
    val2["add"] = ADR
    val2["post"] = POST
    val2["oper"] = OPER
    val2["desc"] = DESC
    val2["t0"] = TEL[0]
    val2["t1"] = TEL[1]
    val2["t2"] = TEL[2]
    val2["t3"] = TEL[3]

	$.post("http://br.open-closed.org/admin2/inc/action_branch2.php",
    {p:CNTR,bid:BID1,val:val2}).done(function(data)
	{
		g = JSON.parse(data)
		if (g["mes"]=="1")
		{
			console.log("+1 POST2")
			POST2STATE = 0
		}
		else
		{
			console.log("Double POST2")
			POST2STATE = 10
		}
	})
}


function StaticVar()
{
	WorkArray = localStorage["DoneInfo"].split("\n")

	Delay = 1000;

	CURBRANCH = 0
	
	CURBRANCH--
    
    
	COUNTER = CURBRANCH
	BRANCHLEN = 13
	CURSTEP = 1;
	CAT = "349"
	CNTR = "br"
	STATEARRAY = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
	COUNTRY ="Brasil"
	LINK = "http://www.puket.com.br/encontrar-lojas"
	TEL[1]="Email: lojavirtual@puket.com.br"

	DESC = "Política de Troca e Devoluções\n\n"+
	"Antes de qualquer procedimento, a troca ou a devolução de qualquer produto deverá ser informada ao nosso atendimento pelo telefone (11) 3848-1286 ou pelo e-mail: lojavirtual@puket.com.br.\n"
	
	
	NextStep()
}

function DynamicVar()
{
	CURBRANCH++
	localStorage.setItem("PUKET",CURBRANCH)

	IfNOADD = 0

	document.title=CURBRANCH
	
//Tel: (11) 3848-1286 |  

	OPER = WorkArray[CURBRANCH*BRANCHLEN+12]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+6]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+7]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+8]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+9]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+10]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+11]
    

	if (WorkArray[CURBRANCH*BRANCHLEN]!="_")
	{
		TEL[0]="Tel: "+WorkArray[CURBRANCH*BRANCHLEN]
	}
	else
	{
		TEL[0]="Tel: (11) 3848-1286";
	}
	
	
	CITY = WorkArray[CURBRANCH*BRANCHLEN+5]
	ADR = WorkArray[CURBRANCH*BRANCHLEN+2]+" "+WorkArray[CURBRANCH*BRANCHLEN+3]

	STATE = WorkArray[CURBRANCH*BRANCHLEN+4]
	POST = WorkArray[CURBRANCH*BRANCHLEN+1]

	NAME = "PUKET - SHOPPING  "+CITY+" "+ADR


}

function NextStep()
{
	switch (CURSTEP)
	{
		case 1:
			LAT = ""
			LNG = ""
			CURBID = -1
			CID = -10
			POST1STATE = -1
			DynamicVar()
			GetBID()
			CURSTEP=2
		break;
		case 12:
		case 2:
			if (CURBID!=-1)
			{
				CURSTEP++
			}
		break;
		case 3:
			CURSTEP++ 
		break;
		case 4:
			if (CITY!=-1)
			{
				CURSTEP++
			}
		break;
		case 5:
			GetLatLng()
			CURSTEP++
		break;
		case 6:
			if (LAT!=-1)
			{
				CURSTEP++
			}
		break;
		case 7:
			CURSTEP++
			GetCID()
		break;
		case 8:
			if (CID!=-10)
			{
				if (CID!=-1)
				{
					CURSTEP++
				}
				else
				{
					ADCITY()
					CURSTEP=8
				}
			}
		break;
		case 9:
			POST1()
			CURSTEP++
		break;
		case 10:
			if (POST1STATE!=-1)
			{
				if (POST1STATE==0)
				{
					CURSTEP++
				}
				else
				{
					CURSTEP=1
				}
			}
		break;
		case 11:
			GetBID();
			CURSTEP++
		break;
		case 13:
			POST2()
			CURSTEP++	
		break;
		case 14:
			if (POST2STATE!=-1)
			{
				if (POST2STATE==0)
				{
					CURSTEP=1
					COUNTER++
				}
				else
				{
					console.log("error "+CURBRANCH+" POST2")
					CURSTEP=1
				}
			}
		break;
		default:
		{
			alert("что-то пошло не так")
		}
	}

	setTimeout(NextStep,Delay)

}

function ReplaceXeRbNbIO(stri)
{
	str = stri;
	str=str.replace(/[áã]{1}/gi,"a")
	str=str.replace(/[óô]{1}/gi,"o")
	str=str.replace(/[êé]{1}/gi,"e")
	str=str.replace(/[ç]{1}/gi,"c")
	str=str.replace(/[ú]{1}/gi,"u")
	str=str.replace(/[î]{1}/gi,"i")
	return str
}
