s = document.location["hostname"]+document.location["pathname"]+document.location["search"]
s = s.replace(/\d+$/,"")
g = "";
CatName = "";

counter = 2

function getNameCat()
{
    $.get("http://"+s+"2").done(function (data)
    {
        CatName = data.match(/(<span class="label label-primary">)([^<]+)(<\/span>)/i)[2];
        getCat()
    })
}

function getCat(){
    $.get("http://"+s+counter).done(function (data)
    {
        reg = RegExp('<a href="[^"]+">'+CatName+'<')
        if (data.match(reg)!=undefined)
        {
            if (data.match(/<div class="amount[^"]+"[^>]*>[^<]*<[^>]*>\d+[^<]*<[^>]*>[^<]*<[^>]*>\d+<[^>]*>[^<]*<[^>]*>\d+<[^>]*>/gi)!=undefined)
            {
                if (data.match(/<div class="amount[^"]+"[^>]*>[^<]*<[^>]*>\d+[^<]*<[^>]*>[^<]*<[^>]*>\d+<[^>]*>[^<]*<[^>]*>\d+<[^>]*>/gi)[0].match(/\d+/gi)[4]<6)
                {
                    g+="http://"+s+counter+"\n";
                    g+=data.match(/(<span class="label label-primary">)([^:]+)(:[^<]*<\/span>)/i)[2]+"  "+data.match(/<div class="amount[^"]+"[^>]*>[^<]*<[^>]*>\d+[^<]*<[^>]*>[^<]*<[^>]*>\d+<[^>]*>[^<]*<[^>]*>\d+<[^>]*>/gi)[0].match(/\d+/gi)[4]+"\n"
                }
                counter++
                setTimeout(getCat,10)
            }
            else
            {
                writeres(g)
            }
        }
        else
        {
            if (counter>1000)
            {
                writeres(g)
            }
            else
            {
            counter++
            setTimeout(getCat,10)
            }
        }
    }).error(function(data){
        console.log(data)
    })
}


function writeres(g)
{
    console.log("NotFound")
    localStorage.setItem("CatLinks",g)
    k = localStorage["CatLinks"].split("\n")
    t="";
    for (i=0;i<k.length/2;i++)
    {
        t += '<button><a href="'+k[i*2]+'" target="_blank">'+k[i*2+1]+'</a></button><br><br>'
    }      
    document.getElementsByTagName("html")[0].innerHTML=t
}





