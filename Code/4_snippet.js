var STATE; var MapRes; var CURBID; var CID; var CITY; var ADR;
var POST; var LINK; var LNG; var LAT; var NAME; var OPER; var DESC;
var TEL = ["","","",""]; var CURSTEP; var MapTypeDO;var CURBRANCH; var POST1STATE;
var POST2STATE; var Delay; var WorkArray; var CAT; var COUNTRY; var CNTR; var BRANCHLEN; var STATEARRAY;


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
	$.post("inc/action_search.php",{p:CNTR,t:"0",q:CITY+","}).done(function(data)
	{
		if (data!="[]")
		{
			g = JSON.parse(data)
			for (i in g)
			{
				if ((CITY+", "+STATE).toLowerCase()==ReplaceXeRbNbIO(g[i]).toLowerCase())
				{
					CID=i
				}
			}
		}
		if (CID==-10)
		{
			CID=-1
		}
	})
}

function ADCITY()
{
	CID = -10
	$.post("http://br.open-closed.org/admin2/index.php?p=br&menu=2&tab=2&cit=new",{state:STATEARRAY.indexOf(STATE)+1,name:CITY,post:"",Submit_ct:""}).done(function(data)
	{
		GetCID()
	})
}

function WorkMap(adr,WYD) // Ищет -1
{
	MapRes = -1;
	MapTypeDO = WYD
	$.get("http://maps.googleapis.com/maps/api/geocode/json?"+adr).done(function(data)
	{
		MapRes = data;
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
				alert("Error in maps")
			}
			break;
			case 3://CITY
			g = MapRes.results[0].address_components
			CITY = -1
			for (i in g)
			{
				if(g[i].types[0]=="administrative_area_level_2")
				{
					CITY = g[i].long_name
				}
			}
			if (CITY==-1)
			{
				alert("Error in maps")
			}
			break;
			case 4://CITY+POST
			g = MapRes.results[0].address_components
			CITY = -1
			POST = -1
			for (i in g)
			{
				if(g[i].types[0]=="administrative_area_level_2")
				{
					CITY = g[i].long_name
				}
				if(g[i].types[0]=="postal_code")
				{
					POST = g[i].long_name
				}
			}
			if (CITY==-1)
			{
				alert("Error in maps")
			}
			if (POST==-1)
			{
				alert("Error in maps")
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
			console.log("+1")
			POST1STATE = 0
		}
		else
		{
			console.log("Double")
			POST1STATE = 10
		}
	})
}

function POST2()
{
	var val2 = {}
    val2["bid"] = CURBID
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
    {p:CNTR,val:val2}).done(function(data)
	{
		g = JSON.parse(data)
		if (g["Error"][0]=="B")
		{
			console.log("+1")
			POST2STATE = 0
		}
		else
		{
			console.log("Double")
			POST2STATE = 10
		}
	})
}

function ChooseOPER()
{
	RandA = Math.floor(Math.random()*97);
	if (RandA>=0 && RandA<=2)
{
	OPER=	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-10:00-17:00-0-00:00-00:00\n"+
""
}
if (RandA>=3 &&  RandA<=8)
{
	OPER=	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-20:00-0-00:00-00:00\n"+
""
}
if (RandA>=9 &&  RandA<=26)
{
	OPER=	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-10:00-17:00-0-00:00-00:00\n"+
""
}
if (RandA>=27 &&  RandA<=68)
{
	OPER=	"1-10:00-21:00-0-00:00-00:00\n"+
	"1-10:00-21:00-0-00:00-00:00\n"+
	"1-10:00-21:00-0-00:00-00:00\n"+
	"1-10:00-21:00-0-00:00-00:00\n"+
	"1-10:00-21:00-0-00:00-00:00\n"+
	"1-10:00-20:00-0-00:00-00:00\n"+
	"1-11:00-19:00-0-00:00-00:00\n"+
""
}
if (RandA>=69 &&  RandA<=72)
{
	OPER=	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-10:00-17:00-0-00:00-00:00\n"+
""
}
if (RandA>=73 &&  RandA<=74)
{
	OPER=	"1-09:00-22:00-0-00:00-00:00\n"+
	"1-09:00-22:00-0-00:00-00:00\n"+
	"1-09:00-22:00-0-00:00-00:00\n"+
	"1-09:00-22:00-0-00:00-00:00\n"+
	"1-09:00-22:00-0-00:00-00:00\n"+
	"1-09:00-22:00-0-00:00-00:00\n"+
	"1-12:00-21:00-0-00:00-00:00\n"+
""
}
if (RandA>=75 &&  RandA<=77)
{
	OPER=	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-10:00-17:00-0-00:00-00:00\n"+
""
}
if (RandA>=78 &&  RandA<=80)
{
	OPER=	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-14:00-20:00-0-00:00-00:00\n"+
""
}
if (RandA>=81 &&  RandA<=85)
{
	OPER=	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-10:00-17:00-0-00:00-00:00\n"+
""
}
if (RandA>=86 &&  RandA<=87)
{
	OPER=	"1-08:30-20:00-0-00:00-00:00\n"+
	"1-08:30-20:00-0-00:00-00:00\n"+
	"1-08:30-20:00-0-00:00-00:00\n"+
	"1-08:30-20:00-0-00:00-00:00\n"+
	"1-08:30-20:00-0-00:00-00:00\n"+
	"1-08:30-19:00-0-00:00-00:00\n"+
	"0-00:00-00:00-0-00:00-00:00\n"+
""
}
if (RandA>=88 &&  RandA<=94)
{
	OPER=	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-10:00-22:00-0-00:00-00:00\n"+
	"1-14:00-20:00-0-00:00-00:00\n"+
""
}
if (RandA>=95 &&  RandA<=96)
{
	OPER=	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-09:00-20:00-0-00:00-00:00\n"+
	"1-10:00-17:00-0-00:00-00:00\n"+
""
}
}


function StaticVar()
{
	WorkArray = localStorage["32"].split("\n")
	Delay = 100;
	CURBRANCH = 1
	BRANCHLEN = 12
	CURSTEP = 0;
	CAT = "239"
	CNTR = "br"
	STATEARRAY = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
	COUNTRY ="Brasil"
	LINK = "https://www.ortobom.com.br/lojas"
	DESC = "Produtos\n\n"+
	"Os melhores colchões e mais procurados pelo público.\n"+
	"Produto de primeira necessidade.\n"+
	"Produtos exclusivos para seu negócio.\n"+
	"Marca\n\n"+
	"Representar a marca mais lembrada pelo consumidor.\n"+
	"Líder absoluta em seu segmento.\n"+
	"Referência de qualidade em todo Brasil.\n"+
	"Negócio\n\n"+
	"Taxa de franquia acessível.\n"+
	"Produtos em consignação.\n"+
	"Treinamentos com acesso ilimitado e livre de custos na fábrica."

	NextStep()
}

function DynamicVar()
{
	CURBRANCH++
	NAME = "XZ"
	//ChooseOPER()
	OPER = WorkArray[CURBRANCH*BRANCHLEN+5]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+6]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+7]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+8]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+9]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+10]+"\n"+
			WorkArray[CURBRANCH*BRANCHLEN+11]

	STATE = WorkArray[CURBRANCH*BRANCHLEN+4]
	if (WorkArray[CURBRANCH*BRANCHLEN]!="")
	{
		TEL[0]="Tel "+WorkArray[CURBRANCH*BRANCHLEN];
	}
	else
	{
		TEL[0]="Standart Phone";
	}
	ADR = WorkArray[CURBRANCH*BRANCHLEN+2]+" "+WorkArray[CURBRANCH*BRANCHLEN+3]
	POST = WorkArray[CURBRANCH*BRANCHLEN+1]

}

function NextStep()
{
	switch (CURSTEP)
	{
		case 0:
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
			GetCityNameByPost()
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
				}
				else
				{
					console.log("error "+CURBRANCH)
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
}
