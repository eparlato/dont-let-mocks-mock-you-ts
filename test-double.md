# Don't Let Mocks Mock You

Questi sono i riferimenti teorici che guideranno il workshop "Don't Let Mocks Mock You". Essi forniscono le basi
concettuali essenziali che verranno applicate e approfondite nelle varie sezioni pratiche, garantendo una comprensione
solida delle metodologie di test trattate e dei motivi che ci portano a identificare quali approcci siano più efficaci.

Table of Contents:

- [Test Double](#test-double)
  - [Dummy Objects](#dummy-objects)
  - [Fake Objects](#fake-objects)
  - [Stubs](#stubs)
  - [Spies](#spies)
  - [Mock Objects](#mock-objects)
- [Piramide dei test](#piramide-dei-test)
  - [Unit Tests](#unit-tests)
  - [Component Tests](#component-tests)
  - [API Tests](#api-tests)
  - [End-to-End (E2E) Tests](#end-to-end-e2e-tests)
- [Altri tipi di test](#altri-tipi-di-test)
  - [Integration Tests (verso sistemi esterni)](#integration-tests-verso-sistemi-esterni)
  - [Contract Tests](#contract-tests)
- [License](#license)

## Test Double

Nel contesto dei test, specialmente per Unit Tests e Component Tests, spesso ci troviamo di fronte a dipendenze esterne
o a componenti che non vogliamo testare direttamente (ad esempio, servizi esterni, database, o componenti complessi e
lenti). Per gestire queste situazioni e mantenere i test veloci, isolati e affidabili, si utilizzano i "Test Doubles".
Un "Test Double" è un termine generico per qualsiasi oggetto che si sostituisce a un oggetto reale per scopi di test. È
un po' come una controfigura in un film.

Approfondiamo i vari tipi di Test Doubles.

### Dummy Objects

Sono gli oggetti più semplici tra i test doubles. Vengono passati ma in realtà non vengono mai utilizzati. Servono
solo a "riempire" i parametri di un metodo. Spesso sono `null` o istanze di classi vuote che non hanno alcun
comportamento significativo.

**Quando usarli:** Quando un metodo richiede un oggetto come argomento ma non lo usa effettivamente per l'esecuzione
del test corrente. Non ci si aspetta alcuna interazione con essi.

### Fake Objects

Contengono un'implementazione funzionante, ma semplificata, dello stesso comportamento dell'oggetto reale che
sostituiscono. Ad esempio, un `FakeDatabase` potrebbe utilizzare una `HashMap` in memoria per simulare le operazioni
di un database reale, anziché interagire con un database persistente.

**Quando usarli:** Quando un'implementazione reale è troppo complessa o lenta per i test (es. un database reale, un
servizio di rete), ma abbiamo bisogno che il test double abbia una logica interna basilare per simulare un
comportamento reale senza gli svantaggi di performance o complessità dell'ambiente.

### Stubs

Forniscono risposte pre-programmate alle chiamate che ricevono durante un test. Essenzialmente, contengono una
logica minima per "fornire" dati specifici al "sotto test" (System Under Test - SUT) o per simulare condizioni
specifiche. Non contengono asserzioni sul comportamento del SUT.

**Quando usarli:** Quando il test ha bisogno di controllare lo stato del SUT o di fornire dati specifici al SUT. Ad
esempio, uno stub può essere configurato per restituire un valore fisso o lanciare un'eccezione quando un certo
metodo viene chiamato.

### Spies

Sono stub che registrano anche informazioni sulle chiamate che ricevono. Permettono di verificare che un certo
metodo sia stato chiamato, quante volte e con quali argomenti, senza modificare il comportamento dell'oggetto reale
o mockarlo completamente.

**Quando usarli:** Quando vogliamo asserire che una certa interazione (una chiamata a un metodo) sia avvenuta sul
test double, ma l'oggetto spia deve anche continuare a comportarsi come uno stub (restituire valori o eseguire una
logica minima). Sono utili per verificare il _comportamento_ indiretto del SUT.

### Mock Objects

Sono oggetti pre-programmati con le aspettative di comportamento (cioè, quali metodi ci si aspetta che vengano
chiamati, con quali argomenti e in quale ordine, se rilevante). Il test fallisce se queste aspettative non vengono
soddisfatte. I mock contengono asserzioni sul comportamento del SUT, a differenza degli stub.

**Quando usarli:** Quando il comportamento di un test è determinato da come il SUT _interagisce_ con le sue
dipendenze, piuttosto che dallo stato restituito da esse. I mock sono particolarmente utili per il testing "
behavior-driven", dove si vuole verificare che il SUT invii i messaggi corretti ai suoi collaboratori.

In sintesi, la scelta del tipo di Test Double dipende dallo scopo specifico del test: se si vuole simulare un input (
Stub), verificare un output specifico (Stub/Fake), controllare che una dipendenza venga utilizzata correttamente (Spy),
o asserire che una sequenza di interazioni avvenga (Mock). Utilizzare i Test Doubles in modo appropriato è fondamentale
per scrivere test di unità efficaci, che siano veloci, affidabili e facili da mantenere.

## Piramide dei test

La **Piramide dei Test** è un modello strategico per l'organizzazione dei test nel processo di sviluppo software.

![Piramide test Diamante.svg](Piramide%20test%20Diamante.svg)

Questo approccio mira a ottimizzare l'efficienza e l'efficacia dei test, suddividendoli in diverse categorie basate
sulla loro velocità, granularità e costo. L'idea è di avere un numero maggiore di test veloci ed economici alla base e
un numero minore di test più lenti e costosi al vertice, contribuendo significativamente alla qualità del software.
È importante distinguere tra test che verificano l'_**implementazione**_ (o "white-box testing", che richiedono
conoscenza del codice interno) e test che verificano il _**comportamento**_ (o "black-box testing", che si concentrano
sull'output esterno senza conoscenza interna).

Le categorie della piramide, dalla base al vertice, sono:

### Unit Tests

Caratteristiche principali:

- Sono la base della piramide e costituiscono la maggior parte dei test.
- Si concentrano su piccole porzioni di codice, come singole funzioni o metodi, testandole in isolamento.
- Sono molto veloci da eseguire e facili da scrivere, fornendo feedback immediato agli sviluppatori.
- L'obiettivo è verificare che ogni unità di codice funzioni correttamente, assicurandone la qualità a un livello
  granulare. Questi test verificano principalmente l'_**implementazione**_, poiché richiedono una conoscenza
  approfondita del codice sorgente testato.

All'interno dei test di unità, si possono distingue due categorie e approcci principali:

- **Solitary Unit Tests**: Questi test sono eseguiti in completo isolamento. Ogni
  dipendenza della "unità sotto test" (Unit Under Test - UUT) viene sostituita da "test doubles" (come mock, stub,
  spy, ecc.), assicurando che venga testata solo la logica interna dell'UUT. L'obiettivo è isolare il più possibile l'
  errore, indicando esattamente quale unità non funziona come previsto. Questo approccio è utile per verificare la
  logica interna complessa e garantire che le modifiche a un'unità non introducano regressioni inaspettate a causa
  delle interazioni con altre unità. Tuttavia, non verificano come l'unità interagisce con le sue dipendenze reali.
- **Sociable Unit Tests**: Questi test permettono alla "unità sotto test" di interagire con
  alcune delle sue dipendenze reali, anziché sostituirle tutte con dei test double. Tipicamente, vengono coinvolte
  dipendenze che sono in-memory o veloci da inizializzare (es. classi di dominio, piccole utilità), mentre le
  dipendenze esterne (es. database, servizi remoti) vengono comunque simulate. L'obiettivo è verificare non solo la
  logica interna dell'unità, ma anche la corretta interazione tra l'unità e i suoi collaboratori più stretti. Questo
  può aiutare a trovare problemi di integrazione a un livello più basso, prima dei test di componente o API. Sono più
  lenti dei test solitari ma più veloci dei test di integrazione di alto livello.

Entrambi gli approcci hanno il loro valore e la loro applicazione dipende dalla natura dell'unità e dalla strategia di
test complessiva.

### Component Tests

Caratteristiche principali:

- Si focalizzano sul test di un singolo componente o modulo dell'applicazione.
- Verificano che un componente, composto da più unità, funzioni correttamente in isolamento dal resto del sistema,
  simulando le sue dipendenze.
- Sono più lenti dei test di unità ma più veloci e stabili dei test di API o E2E, contribuendo alla qualità del
  software a livello di componente. In questi test si iniziano a verificare i _**comportamenti**_ del componente
  attraverso le sue interfacce interne, e sono meno legati all'implementazione rispetto ai test di unità, in quanto si
  concentrano su come il componente si presenta e risponde alle interazioni esterne (anche se interne all'applicazione
  stessa).

### API Tests

Caratteristiche principali:

- Questi test verificano il corretto funzionamento dell'interfaccia di programmazione dell'applicazione (API).
- Sono utilizzati per verificare il corretto funzionamento e l'integrazione con sistemi esterni (come database,
  servizi di terze parti o altri microservizi).
- Per la loro scrittura e esecuzione, non è necessario conoscere i dettagli implementativi interni dell'applicazione;
  si concentrano piuttosto sull'interazione con l'applicazione come una "black box", rendendoli completamente
  indipendenti dagli _internals_ e focalizzandosi sulla correttezza del _**comportamento**_ dell'interfaccia.

### End-to-End (E2E) Tests

Caratteristiche principali:

- Si trovano al vertice della piramide e sono i meno numerosi.
- Simulano il flusso completo dell'utente attraverso l'applicazione, testando l'intero sistema dalla UI al database o
  attraverso diversi servizi.
- Sono i più lenti, costosi e potenzialmente fragili, poiché dipendono dall'intera infrastruttura.
- Similmente ai test API, non richiedono una conoscenza approfondita dell'implementazione interna dell'applicazione,
  ma si concentrano sul _**comportamento**_ complessivo del sistema dal punto di vista dell'utente, agendo come test "
  black-box" e mantenendo la completa indipendenza dagli _internals_. Questi test sono cruciali per garantire la
  qualità dell'esperienza utente finale.

L'applicazione di questa piramide consente di ottimizzare i tempi e i costi complessivi nello sviluppo software,
garantendo al contempo un'elevata qualità del prodotto finale.

## Altri tipi di test

Oltre ai livelli della Piramide dei Test, esistono altri approcci e tipi di test che sono fondamentali per assicurare la
robustezza e l'affidabilità delle applicazioni, specialmente in contesti distribuiti o con dipendenze esterne.

### Integration Tests (verso sistemi esterni)

Mentre la piramide dei test si concentra principalmente sui test all'interno dei confini dell'applicazione (anche se i
test API e E2E possono coinvolgere interazioni con servizi fittizi o ambienti di test controllati), il termine "
Integration Tests" viene spesso utilizzato in un contesto più ampio per riferirsi a test che verificano l'interazione
della nostra applicazione con _sistemi esterni reali_, come database reali, servizi di terze parti o altri microservizi
non sotto il nostro controllo diretto.
Questi test sono spesso lenti, costosi e meno stabili, poiché dipendono dalla disponibilità e dalla configurazione
di ambienti esterni. Per questo motivo, non rientrano tipicamente nei livelli della piramide, che privilegia test
veloci e isolati.

Sono cruciali per convalidare la corretta comunicazione e lo scambio di dati con dipendenze reali e sono solitamente
eseguiti in ambienti di test specifici (es. Staging, QA) piuttosto che in fase di sviluppo locale. L'obiettivo è
verificare che la nostra applicazione possa interagire correttamente con il mondo esterno.

### Contract Tests

I test di contratto si posizionano come un ponte tra i test di unità/componente e i test di integrazione, in
particolare per le interazioni API. Il loro scopo è garantire che l'interfaccia tra due componenti (un "consumer" e
un "provider", tipicamente attraverso un'API) rimanga compatibile nel tempo.

Possiamo identificare 2 differenti tipologie di Contract Tests:

- **API pubbliche della nostra applicazione**: questi test verificano che la nostra API (il "provider") aderisca al
  contratto (specifiche dell'API) che abbiamo promesso ai nostri "consumer". I test sono scritti dal punto di vista del
  consumer e vengono eseguiti contro il provider. Se il provider modifica l'API in modo incompatibile, i test di
  contratto
  falliscono, avvisando immediatamente i team.
- **API dei sistemi esterni che chiamiamo**: qui la nostra applicazione è il "consumer" di un'API esterna. I test di
  contratto verificano che la nostra applicazione sia in grado di interagire correttamente con l'API del sistema
  esterno,
  basandosi su un contratto concordato. Se l'API esterna cambia in modo incompatibile con il nostro utilizzo, i test di
  contratto falliscono, avvisandoci del problema prima che venga scoperto in un ambiente di integrazione più costoso o
  in
  produzione.

I test di contratto sono più veloci dei test di integrazione completi perché spesso non richiedono l'effettiva
esecuzione di tutta la logica del provider o del consumer, ma si concentrano sulla validazione del formato e del
contenuto delle richieste/risposte secondo il contratto. Aiutano a ridurre il numero di test di integrazione
end-to-end necessari e rendono i flussi di sviluppo distribuiti più robusti.

## License

Copyright (c) 2025 Marco Zamprogno and Gianni Bombelli

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
version.
