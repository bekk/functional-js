# Utkast til agenda

- Hei og velkommen
- Intro: Hva er funksjonell programmering
    - "Funksjonelle språk" finnes ikke, men språk legger til rette for funksjonell programmering i ulik grad
    - Høyere ordens funksjoner
        - dvs, komponering av funksjonalitet vha funksjoner
    - Immutable state
        - mindre kompleksitet
        - eksempel med Angular sin run-loop som ikke er immutable? (sammenlign med shouldComponentUpdate i react+immutable.js)
    - Begreper vi kommer til å bruke, som deltagerne må kjenne (veldig kort)
        - Closures
        - Lexical scoping
        - Monad: "Monoid in the category of endofunctors." (for LOLs)
            + ref: http://james-iry.blogspot.no/2009/05/brief-incomplete-and-mostly-wrong.html
- Praktisk: Hvordan komme i gang med kodingen på en praktisk måte

- Hva er en funksjon (i JS)
    + fn som objekter -> funksjoner kan ha funksjoner som "members"
    + `this`
        + prototyper
        + konstruktør-funksjoner
    + `call`, `apply`, `arguments`

- Høyere ordens funksjoner
    - Kort: Hva er en HOF / førsteklasses funksjon
    - bruke lodash
    - the use of generic functions built on a collection-centric philosophy
    - Funksjon som returnerer funksjon: `makeAdder`
    - Funksjon som tar funksjon som arg: ??
    - Dekoratorer: `debounce`, `throttle`, `memoize`
    - State vha closures: `counter`, `timer`, `uniqeid`
    - Presentere `filter`, `map`, `reduce` (fra `_`)
    - Oppgaver
        + bruke `filter` til ting
        + bruke `map` til ting
        + bruke `reduce` til ting
        + implementere de over selv (optional)

*(pause)*

- Partial applicaton
    - Teori: Hva er dette / vise megabasic eksempel med _
    - Nyttig bruk: `.on('change', _.partial(fn, 'foo')`
    - Tips: flip
    - Oppgaver:
        - Implementere `partial` selv

- Rekursjon (trenger vi denne?)
    + TCO kommer i ES6
    + Eksempel: Traversering av trær
    + Kode:

            def reverse(liste):
                baklengs = []
                for x in liste:
                    baklengs.append(x)
                return baklengs

            def reverse(liste):
                if liste == []: return []
                else: return reverse(liste[1:]) + [liste[0]]

    + Oppgaver:
        * ???

*(lunchpause)*

- Tilstand
    - Hvorfor immutable state? Enklere å debugge og teste
    - Pragmatisk: alt må ikke være immutable, state har en plass
    - State kan komme og bite deg i ræva
        - Pass by reference vs pass by value
        - Farligheten med at andre kan modifisere shit etter at vi er ferdig med det
        - KJ finner eksempel, cache
    - Muligjør memoisering
    - Clone vs deepClone
    - object.freeze
    - Tips: implementere `deepFreeze`
    - Teknikker for å abstrahere bort state
        + `timer`
        + ???
    - Oppgaver:
        + ???

- Diverse nyttige funksjoner
    + `pluck`
    + `find`
    + `any`, `all`
    + `compose`
    + Oppgaver:
        * Diverse bruk av funksjonene over

*(pause)*

- Idé til større del
    + Implementere så mye som mulig av `_` fra bunnen av
    + Bruk immutable.js sammen med React.js (til state, props er immutable)
    + Litt større ting vha Node
        * Presentere data fra et kult API på en ny måte? (som krever en del transformering der funksjonelle konsepter kan passe godt inn)
        * Se etter API som er relevant!
