var k;
var branchid;
var s;
var filtname="Farma_Cia"
D1="Seg"
D2="Ter"
D3="Qua"
D4="Qui"
D5="Sex"
D6="Sab"
D7="Dom"

additTime="True"


function LoadNewLinks()
{
    if (document.getElementsByClassName("load-more-loading").length>0)
    {
        setTimeout(LoadNewLinks,10)
    }
    else
    if (document.getElementsByClassName("load-more-btn").length>0)
    {
        document.getElementsByClassName("load-more-btn")[0].click()
        setTimeout(LoadNewLinks,10)
    }
    else
    {
        getStarter()
    }
}

function getStarter()
{
    console.log("AllDone")
    g = document.getElementsByClassName("poi card") 
    s = ""; 
    for (i in g) 
    { 
        if (g[i].children!=undefined) 
            s += g[i].children[0].children[0].href+"\n" 
    }
    k=s.split("\n")
    branchid=0
    s = "" 
    GetBranch()
}

function SuplayerGetBranch()
{
    if (branchid<k.length-1)
    {
        branchid++
        if (branchid/20==(branchid-branchid%20)/20) 
        console.log(branchid)
        setTimeout(GetBranch,1)
    }
    else
    {
        localStorage.setItem("ParseInfo",s)
        console.log("Done")
        PrepareBranch()
    }
}

function GetBranch(){
    if (k[branchid].match(RegExp(filtname,"gi"))!=undefined)
    {
        $.get(k[branchid]).done(function(g){

            if (g.match(/\(\d{2}\) \d{4}-\d{4}/gi)!=undefined) 
                tel = g.match(/\(\d{2}\) \d{4}-\d{4}/gi)[0] 
            else
                tel = "_"

            if (g.match(/\d{5}-\d{3}/gi)!=undefined) 
                cep = g.match(/\d{5}-\d{3}/gi)[0]  
            else
                cep = "_"
            //time
            if (g.match(/(([a-z]{3})|([a-z]{3} à [a-z]{3}))(:<[^>]+>)([^\d]*)((\d{2}[^\d]{1}\d{2}) às (\d{2}[^\d]{1}\d{2}))/gi)!=undefined)
            {
                time=g.match(/(([a-z]{3})|([a-z]{3} à [a-z]{3}))(:<[^>]+>)([^\d]*)((\d{2}[^\d]{1}\d{2}) às (\d{2}[^\d]{1}\d{2}))/gi).join("").replace(/(\n)|( às)|(<[^>]+>)/gi,"")
            }
            else
                time = "_"
            //time
            if (g.match(/<span itemprop="streetAddress">[^<]+<[^<]+<[^<]+/gi)!=undefined) 
                Adr = g.match(/<span itemprop="streetAddress">[^<]+<[^<]+<[^<]+/gi)[0].replace(/<[^>]+>[\s]?/gi, "");  
            else
                Adr = "_"

            if (g.match(/<span itemprop="addressRegion"[^>]+>/gi)!=undefined) 
                stat = g.match(/<span itemprop="addressRegion"[^>]+>/gi)[0].replace(/<[^"]+"[^"]+"[^"]+"/i, "").replace(/".+/i, ""); 
            else
                stat = "_"

            if (g.match(/(<span itemprop="addressLocality"[^>]+>\s+<a href="[^>]+>)([^>]+)(<\/a>)/gi)!=undefined)
                city = g.match(/(<span itemprop="addressLocality"[^>]+>\s+<a href="[^>]+>)([^>]+)(<\/a>)/i)[2].slice(1,-1)
            else
                city = "_"


            s+=tel+"\n"+cep+"\n"+Adr+"\n"+stat+"\n"+city+"\n"+time+"\n"
        
        SuplayerGetBranch()
    })
    }
    else
    {
        SuplayerGetBranch()
    }
}

function PrepareBranch(){

    g = localStorage["ParseInfo"]
    k = []

    k = g.match(/[^\n]+\n\d{5}-\d{3}\n[^\n]+\n[^\n]+\n[A-Z]{2}\n[^\n]+\n[^\n]+/gi)
    g = ""

    timecol = []
    t = []
    for (i in k)
    {
        m = k[i].match(/((([a-z]{3} [^ ]? [a-z]{3}:)|([a-z]{3}:))(\d{2}:\d{2} \d{2}:\d{2}))/gi)
        time = ["0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00",
        "0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00",
        "0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00"]

        for (g in m)
        {
            days = m[g].match(/\w{3}/g)
            times = m[g].match(/\d{2}:\d{2}(?:( ))\d{2}:\d{2}/g)[0].match(/\d{2}:\d{2}/g)

            days[days.indexOf(D7)]=7
            days[days.indexOf(D1)]=1
            days[days.indexOf(D2)]=2
            days[days.indexOf(D3)]=3
            days[days.indexOf(D4)]=4
            days[days.indexOf(D5)]=5
            days[days.indexOf(D6)]=6

            if (days.length<2)
            {
                days.push(days[0])
            }

            if (days[0]>days[1])
            {
                buf = days[0]
                days[0]=days[1]
                days[1]=buf;
            }
            for (q = days[0];q<days[1]+1;q++)
            {
                time[q-1] = "1-"+times[0]+"-"+times[1]+"-0-00:00-00:00"
            }

        }


        t.push(k[i].match(/[^\n]+\n\d{5}-\d{3}\n[^\n]+\n[^\n]+\n[A-Z]{2}\n[^\n]+\n/gi)[0]+time.join("\n"))
        timecol.push(time.join("\n"))
    }
    t


    g = []
    m = []
    prev = ""
    for ( i in timecol)
    {
        if (timecol[i]==prev)
        {
            g[g.length-1]+=1
        }
        else
        {
            m.push(timecol[i])
            g.push(1)
        }
        prev = timecol[i]
    }

    s = t.join("\n")

    if (additTime=="True")
    {
        m = s.match(/(\d{1}(-\d{2}:\d{2}){2}-\d{1}(-\d{2}:\d{2}){2}\n){7}/g)
        m.sort()

        deftime = ["0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00",
        "0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00",
        "0-00:00-00:00-0-00:00-00:00","0-00:00-00:00-0-00:00-00:00"].join("\n")
        prev=""
        g = [];
        k = [];
        for (i in m)
        {
            if (m[i]==prev)
            {
                k[k.length-1]+=1
            }
            else
            {
                g.push(m[i])
                k.push(1)
            }
            prev = m[i]
        }
        k = k.slice(1)
        g = g.slice(1)

        if (k.length>0)
        {
            sum = k.reduce(function(sums,current){return sums+current})

            j = [];
            m = s.match(/(\d{1}(-\d{2}:\d{2}){2}-\d{1}(-\d{2}:\d{2}){2}\n){7}/g)
            for (i in t)
            {
                if (t[i].match(RegExp(deftime))!=undefined)
                j.push(t[i].replace(deftime,"")+g[k.reduce(function(minus,cur,i,arr){if (minus[0]-cur>0 && minus[1]<0)return [minus[0]-cur,minus[1]];else if (minus[1]<0) return [minus[0],i];else return minus}, [Math.floor(Math.random()*(sum+1)),-1])[1]].slice(0,-1))
                else
                j.push(t[i])
            }
            s = j.join("\n")
        }
    }



    localStorage.setItem("DoneInfo"+filtname,s)
    console.log("We have "+s.split("\n").length/13+" Branches")
}