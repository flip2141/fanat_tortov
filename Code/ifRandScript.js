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
sum = 0
for (i in g)
{
    sum+=g[i]
}
for (i in g)
{
    g[i] = g[i]/sum*100
}
k = []
p = []
for (i in g)
{
    if (g[i]>1)
    {
        k.push(Math.round(g[i])+1)
        p.push(m[i])
    }
}
g = 0
s=""
for (i in k)
{
    s+="if (RandA>="+g+" and RandA<="+(g+k[i]-1)+")\n{\n\tOPER="
    for (q in m[i].split("\n"))
    {
        s+='\t"'+m[i].split("\n")[q]+'\\n"+\n'
    }
    s+='""'+"\n}\n"
    g+=k[i]
}
localStorage.setItem("IF",s)