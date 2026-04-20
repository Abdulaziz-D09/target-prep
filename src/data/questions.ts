export interface Question {
    id: string;
    type: 'Reading' | 'Grammar' | 'Math';
    passage?: string;
    question: string;
    options: string[];
    answer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    calc?: boolean;
}

export interface TestModule {
    questions: Question[];
    timeMinutes: number;
}

export interface TestSection {
    name: string;
    modules: TestModule[];
}

export interface PracticeTest {
    id: number;
    title: string;
    description: string;
    type: string;
    duration: string;
    totalQuestions: number;
    moduleCount: number;
    color: string;
    sections: TestSection[];
}

const englishModule1: Question[] = [
    {
        "id": "em1-f1bfbed3",
        "type": "Reading",
        "passage": "Marta Coll and colleagues’ 2010 Mediterr anean Sea biodiv ersity census r epor ted appr oximately 17,000 species, nearly double the number r epor ted in Carlo Bianchi and Carla Morri’ s 2000 census—a diff erence only par tly attributable t o the description of new invertebrate species in the interim. Another fact or is that the morphological v ariability of micr oorganisms is poorly underst ood compar ed to that of v ertebrates, inv ertebrates, plants, and algae, cr eating uncer tainty about how t o evaluate micr oorganisms as species. Resear chers’ decisions on such matters ther efore can be highly consequential. Indeed, the two censuses r epor ted similar counts of v ertebrate, plant, and algal species, suggesting that ______",
        "question": "Which choice most logically completes the text?",
        "options": ["Coll and colleagues r epor ted a much higher number of species than Bianchi and Morri did lar gely due t o the inclusion of invertebrate species that had not been described at the time of Bianchi and Morri’ s census.","some diff erences obser ved in micr oorganisms ma y have been tr eated as v ariations within species b y Bianchi and Morri but treated as indicativ e of distinct species b y Coll and colleagues.","Bianchi and Morri ma y have been less sensitiv e to the degr ee of morphological v ariation displa yed within a typical species of micr oorganism than Coll and colleagues wer e.","the absence of clarity r egar ding how t o diff erentiate among species of micr oorganisms ma y have resulted in Coll and colleagues under estimating the number of micr oorganism species."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents the conclusion that most logically completes the text’ s discussion of the diff erent counts of species in the Mediterr anean Sea. The text states that Coll and colleagues r epor ted almost double the number of species that Bianchi and Morri r epor ted in their study ten y ears earlier . Accor ding t o the text, this diff erence can only be par tly attributed t o new inv ertebrate species being described in the y ears between the two studies, which means ther e must be an additional fact or that made Coll and colleagues’ count so much higher than Bianchi and Morri’ s count. The text goes on t o explain that fact or: resear chers ha ve a r elativ ely poor understanding of micr oorganisms’ morphological v ariability , or the diff erences in micr oorganisms’ structur e and form. This poor understanding mak es it har d to classify micr oorganisms b y species and means that r esear chers’ decisions about classifying micr oorganisms can ha ve a lar ge eff ect on the o verall species counts that resear chers r epor t. Additionally , the text sa ys that the two censuses r epor ted similar numbers of v ertebrate, plant, and algal species, which means that the diff erence in o verall species did not come fr om diff erences in those categories. Giv en all this information, it most logically follows that Coll and colleagues ma y have treated some of the diff erences among micr oorganisms as indicativ e of the micr oorganisms being diff erent species, wher eas Bianchi and Morri tr eated those diff erences as v ariations within species, r esulting in Coll and colleagues r epor ting many mor e species than Bianchi and Morri did. Choice A is incorr ect because the text explicitly addr esses this issue b y stating that the description of new inv ertebrate species in the y ears between the two studies can explain only par t of the diff erence in the number of species r epor ted b y the studies. The focus of the text is on explaining the diff erence between Coll and colleagues’ count and Bianchi and Morri’ s count that cannot be accounted for b y the inclusion of inv ertebrate species that had not been described at the time of Bianchi and Morri’ s study . Choice C is incorr ect because nothing in the text suggests that Bianchi and Morri ma y have been less sensitiv e to how much the form and structur e of micr oorganisms v ary within the same species than Coll and colleagues wer e. If Bianchi and Morri had been less InferencesDiﬃculty than Coll and colleagues did, since less sensitivity t o within-species v ariation would lead r esear chers t o classify as diff erent species micr oorganisms that mor e sensitiv e resear chers would classify as v ariations within the same species. The text indicates, howe ver, that Bianchi and Morri r epor ted far f ewer species than Coll and colleagues did; since the text also ex cludes other explanations for this diff erence, it suggests that in fact Bianchi and Morri wer e mor e sensitiv e to within-species v ariation than Coll and colleagues wer e, leading Bianchi and Morri t o repor t fewer o verall species. Choice D is incorr ect because the text is focused on explaining why Coll and colleagues r epor ted many mor e species than Bianchi and Morri did, and an under estimate of the number of micr oorganism species b y Coll and colleagues would not explain that diff erence—it would suggest, in fact, that the difference in the number of species should ha ve been e ven lar ger.",
        "difficulty": "Hard"
    },
    {
        "id": "em1-87aa7bab",
        "type": "Reading",
        "passage": "A common assumption among ar t hist orians is that the inv ention of phot ography in the mid-nineteenth centur y displaced the painted por trait in the public consciousness. The diminishing popularity of the por trait miniatur e, which coincided with the rise of phot ography , seems t o suppor t this claim. Howe ver, phot ography ’s impact on the por trait miniatur e ma y be o verstated. Although recor ds fr om ar t exhibitions in the Netherlands fr om 1820 t o 1892 show a decr ease in the number of both full-siz ed and miniatur e portraits submitted, this tr end was established befor e the inv ention of phot ography .",
        "question": "Based on the text, what can be concluded about the diminishing popularity of the por trait miniatur e in the nineteenth centur y?",
        "options": ["Factors other than the rise of phot ography ma y be mor e dir ectly r esponsible for the por trait miniatur e’s decline.","Although por trait miniatur es became less common than phot ographs, the y wer e widely r egar ded as ha ving mor e artistic merit.","The popularity of the por trait miniatur e likely persisted for longer than ar t hist orians ha ve assumed.","As demand for por trait miniatur es decr eased, por trait ar tists lik ely shifted their cr eativ e focus t o phot ography ."],
        "answer": 0,
        "explanation": "Choice A is the best answer . The text sa ys that the impact of phot ography on the por trait miniatur e might be \" overstated, \" as some recor ds show a decr ease in the number of por trait miniatur es befor e the inv ention of phot ography . From this, we can conclude that factors other than the rise of phot ography ma y be mor e dir ectly r esponsible for the por trait miniatur e’s decline. Choice B is incorr ect. The text ne ver discusses the \" artistic merit\" of either ar t form. Choice C is incorr ect. The text ne ver suggests that the por trait miniatur e was popular for longer than hist orians thought—if anything, it suggests that the por trait miniatur e started losing its popularity earlier than hist orians thought. Choice D is incorr ect. The text ne ver suggests that por trait painters shifted t o become phot ographers.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-d73a908a",
        "type": "Reading",
        "passage": "Belie ving that living in an impr actical space can heighten awar eness and e ven impr ove health, conceptual ar tists Madeline Gins and Shusaku Ar akawa designed an apar tment building in Japan t o be mor e fanciful than functional. A kitchen counter is chest- high on one side and knee-high on the other; a ceiling has a door t o nowher e. The eff ect is disorienting but invigor ating: after four years ther e, ﬁlmmak er Nobu Y amaoka r epor ted signiﬁcant health beneﬁts.",
        "question": "Which choice best states the main idea of the text?",
        "options": ["Although inhabiting a home surr ounded b y fanciful f eatur es such as those designed b y Gins and Ar akawa can be r ejuvenating, it is unsustainable.","Designing disorienting spaces lik e those in the Gins and Ar akawa building is the most eff ectiv e wa y to create a physically stimulating envir onment.","As a ﬁlmmak er, Yamaoka has long suppor ted the designs of conceptual ar tists such as Gins and Ar akawa.","Although impr actical, the design of the apar tment building b y Gins and Ar akawa ma y impr ove the well-being of the building’ s residents."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it most accur ately states the main idea of the text. Accor ding t o the text, conceptual ar tists Gins and Ar akawa ha ve designed an apar tment building that is disorienting because of se veral unconv entional elements, such as uneven kitchen counters and “ a door t o nowher e.” The text goes on t o suggest that ther e ma y be beneﬁts t o this kind of design because ﬁlmmak er Yamaoka liv ed in the apar tment building for four y ears and r epor ted health beneﬁts. Thus, although the design is impr actical, it ma y impr ove the well-being of the apar tment building’ s residents. Choice A is incorr ect. Although the text mentions that Y amaoka liv ed in the apar tment for four y ears, it doesn ’t addr ess how long someone can beneﬁcially liv e in a home surr ounded b y fanciful f eatur es or whether doing so can be sustained. Choice B is incorr ect. Although the text mentions the potential beneﬁts of living in a home with disorienting design f eatur es, it doesn ’t suggest that this is the most eff ectiv e method t o create a physically stimulating envir onment. Choice C is incorr ect because the text r efers to Yamaoka t o suppor t the claim that Gins and Ar akawa ’s apar tment building design ma y be beneﬁcial, but the text doesn ’t indicate that Y amaoka suppor ts the designs of other conceptual ar tists.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-d748c3f d",
        "type": "Reading",
        "passage": "In her 2021 ar ticle “Thr owawa y Hist ory: Towar ds a Hist oriogr aphy of Ephemer a,” scholar Anne Garner discusses John Johnson (1882–1956), a de voted collect or of items intended t o be discar ded, including bus tick ets and campaign pamphlets. Johnson recogniz ed that scholarly institutions consider ed his expansiv e collection of ephemer a to be wor thless—indeed, it wasn ’t until 1968, after Johnson ’s death, that Oxfor d Univ ersity ’s Bodleian Libr ary acquir ed the collection, ha ving gr asped the items’ potential value t o hist orians and other r esear chers. Hence, the example of Johnson ser ves to ______",
        "question": "Which choice most logically completes the text?",
        "options": ["demonstr ate the diﬃculties faced b y contempor ary hist orians in conducting r esear ch at the Bodleian Libr ary without access t o ephemer a.","represent the challenge of incorpor ating examples of ephemer a int o the collections of libr aries and other scholarly institutions.","lend suppor t to arguments b y hist orians and other r esear chers who continue t o asser t that ephemer a holds no v alue for scholars.","illustr ate both the r elativ ely low scholarly r egar d in which ephemer a was once held and the later r ecognition of ephemer a’s possible utility ."],
        "answer": 3,
        "explanation": "Choice D is the best answer . Johnson collected “ ephemer a,” or things that ar e meant t o be thr own awa y. Scholars thought his collection was wor thless t o them, then later r ealiz ed that it was potentially v aluable. This suggests that scholars went fr om disregar ding ephemer a to recognizing their usefulness. Choice A is incorr ect. This inf erence isn ’t suppor ted. The text tells us that the Bodleian Libr ary acquir ed Johnson ’s lar ge collection of ephemer a back in 1968, so we can assume that contempor ary hist orians conducting r esear ch ther e do ha ve access t o that collection. Choice B is incorr ect. This inf erence isn ’t suppor ted. The text tells us that “Oxfor d Univ ersity ’s Bodleian Libr ary acquir ed the collection, ” but it ne ver suggests that it was a challenge t o do so. Choice C is incorr ect. This inf erence isn ’t suppor ted. The text actually suggests the opposite: the example of Johnson ’s collection lends suppor t to arguments that ephemer a does hold v alue for scholars.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-6b8a7c74",
        "type": "Reading",
        "passage": "One r ecogniz ed social norm of gift giving is that the time spent obtaining a gift will be viewed as a r eﬂection of the gift’ s thoughtfulness. Mark eting exper ts Farnoush Reshadi, Julian Givi, and Gopal Das addr essed this view in their studies of norms speciﬁcally surr ounding the giving of gift car ds, noting that while r ecipients tend t o view digital gift car ds (which can be pur chased online fr om anywher e and often can be r edeemed online as well) as superior t o physical gift car ds (which sometimes must be purchased in person and ma y only be r edeemable in person) in terms of usage, 94.8 per cent of par ticipants sur veyed indicated that it is mor e socially acceptable t o giv e a physical gift car d to a r ecipient. This ﬁnding suggests that ______",
        "question": "Which choice most logically completes the text?",
        "options": ["gift giv ers lik ely o verestimate the amount of effor t requir ed to use digital gift car ds and thus mistak enly assume gift r ecipients will view them as less desir able than physical gift car ds.","physical gift car ds ar e likely pr eferred b y gift r ecipients because the tangible natur e of those car ds off ers a gr eater psychological sense of ownership than digital gift car ds do.","physical gift car ds ar e likely less desir able t o gift r ecipients than digital gift car ds ar e because of the per ception that physical gift car ds requir e unnecessar y effor t to obtain.","gift giv ers lik ely per ceive digital gift car ds as r equiring r elativ ely low effor t to obtain and thus wr ongly assume gift r ecipients will appr eciate them less than the y do physical gift car ds."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it most logically completes the text’ s discussion of per ceptions of digital v ersus physical gift cards. The text begins b y explaining that the per ception of \"the time spent obtaining a gift…as a r eﬂection of the gift’ s thoughtfulness\" is a social norm of gift giving. The text then explains that although those who r eceiv e digital gift car ds view them as easier t o use than physical gift car ds, a mark eting study nonetheless showed that 94.8% of par ticipants found physical gift cards mor e \"socially acceptable \" to giv e. The text speciﬁcally contr asts the ease with which digital gift car ds \"can be pur chased online fr om anywher e\" with the fact that physical gift car ds \"sometimes must be pur chased in person \"—suggesting the gr eater diﬃculty of obtaining physical car ds. Giv en the text’ s initial pr emise that gift-giving norms equate the thoughtfulness of a gift with the effor t involved in acquiring that gift, it is r easonable t o inf er that people per ceive digital gift car ds as r equiring less effor t to obtain and thus assume r ecipients will appr eciate them less, e ven though r ecipients actually pr efer gift car ds in the mor e usable digital format. Choice A is incorr ect. Although the text does discuss r ecipients’ pr eference of digital v ersus physical gift car ds and the r elativ e ease with which the two formats can be used, it doesn ’t consider the misconceptions that gift giv ers ma y have of these fact ors. Moreover, the text establishes that r ecipients r egar d digital gift car ds as easier t o use and ther efore preferable t o physical gift cards. Choice B is incorr ect because the text doesn ’t consider whether r ecipients of gift car ds feel a sense of ownership t owar d them, nor does the text t ouch on the gr eater tangibility of physical v ersus digital gift car ds. Instead, the text contr asts the two formats of gift car ds in terms of their r espectiv e usability and the diﬃculty inv olved in acquiring them and discusses how those factors inﬂuence people ’s per ceptions of the two formats. Choice C is incorr ect because it contr adicts the text, which explains that recipients r egar d digital gift car ds as superior t o physical ones because the y are easier t o use than physical car ds, not because physical gift car ds requir e greater effor t to obtain than digital gift car ds do. Mor eover, the text doesn ’t char acteriz e the effor t InferencesDiﬃculty",
        "difficulty": "Hard"
    },
    {
        "id": "em1-a15b3219",
        "type": "Reading",
        "passage": "1,300 1,200 1,100 1,000 900 800 700 600 500 400 300 200 100 0Number of municipalities no response responded to inquiry offered incentiveMunicipalities’ Responses to Inquiries about Potential Incentives for Firm announcement before election announcement after election In the United States, ﬁrms often seek incentiv es fr om municipal go vernments t o expand t o those municipalities. A team of political scientists hypothesiz ed that municipalities ar e much mor e likely to respond t o ﬁrms and off er incentiv es if expansions can be announced in time t o beneﬁt local elected oﬃcials than if the y can ’t. The team contacted oﬃcials in thousands of municipalities, inquiring about incentiv es for a ﬁrm looking t o expand and indicating that the ﬁrm would announce its expansion on a date either just befor e or just after the next election.",
        "question": "Which choice best describes data fr om the gr aph that weak en the team ’s hypothesis?",
        "options": ["A lar ge majority of the municipalities that r eceiv ed an inquir y mentioning plans for an announcement befor e the next election didn ’t respond t o the inquir y.","The pr opor tion of municipalities that r esponded t o the inquir y or off ered incentiv es didn ’t substantially diff er acr oss the announcement timing conditions.","Only ar ound half the municipalities that r esponded t o inquiries mentioning plans for an announcement befor e the next election offered incentiv es.","Of the municipalities that r eceiv ed an inquir y mentioning plans for an announcement date after the next election, mor e than 1,200 didn ’t respond and only ar ound 100 off ered incentiv es.Assessment SATTest Reading and W ritingDomain Information and IdeasSkill Command of EvidenceDiﬃculty"],
        "answer": 1,
        "explanation": "Choice B is the best answer . The lighter bars show what happened when the announcement was t o come befor e the election, and the dark er bars show what happened when the announcement was t o come after the election. F or all thr ee of the outcomes, the light and dark bars ar e vir tually the same, demonstr ating that the announcement timing didn ’t actually mak e a diff erence. Choice A is incorr ect. This accur ately describes some data fr om the gr aph, but it doesn ’t weak en the hypothesis. It doesn ’t include the “ announcement after election ” data for comparison. Choice C is incorr ect. This accur ately describes some data fr om the graph, but it doesn ’t weak en the hypothesis. It doesn ’t include the “ announcement after election ” data for comparison. Choice D is incorr ect. This accur ately describes some data fr om the gr aph, but it doesn ’t weak en the hypothesis. It doesn ’t include the “announcement befor e election ” data for comparison.",
        "difficulty": "Hard"
    },
    {
        "id": "em1-ed314256",
        "type": "Reading",
        "passage": "The most r ecent iter ation of the immersiv e theater experience Sleep No Mor e, which pr emier ed in New Y ork City in 2011, transforms its per formance space—a ﬁv e-story war ehouse—int o a 1930s-er a hotel. A udience members, who wander thr ough the labyrinthine v enue at their own pace and follow the act ors as the y pla y out simultaneous, inter weaving narr ative loops, confr ont the impossibility of experiencing the pr oduction in its entir ety. The pla y’s refusal of narr ative coher ence thus hinges on the sense of spatial fr agmentation that the v enue ’s immense and intricate la yout gener ates.",
        "question": "What does the text most str ongly suggest about Sleep No Mor e’s use of its per formance space?",
        "options": ["The choice of a New Y ork City v enue lik ely enabled the pla y’s creators t o experiment with the use of theatrical space in a wa y that v enues fr om earlier pr oductions could not.","Audience members lik ely ﬁnd the experience of the pla y disappointing because the y gener ally cannot mak e their wa y thr ough the entir e venue.","The pr oduction ’s dependence on a par ticular per formance envir onment would lik ely mak e it diﬃcult t o reproduce exactly in a different theatrical space.","Audience members who na vigate the space accor ding t o a r ecommended itiner ary will lik ely ha ve a better gr asp of the pla y’s narrative than audience members who depar t from that itiner ary."],
        "answer": 2,
        "explanation": "Choice C is the best answer . The text sa ys that the pr oduction ’s use of its lar ge, winding space has a v ery speciﬁc eff ect on the audience. Giv en that the space itself is so impor tant t o creating this eff ect, it would be diﬃcult t o reproduce the pr oduction in a different space. Choice A is incorr ect. The fact that the v enue is in New Y ork City isn ’t connected t o the experimental natur e of the per formance. It’s the siz e of the v enue, not its location in New Y ork, that aff ects the theatrical experience. Choice B is incorr ect. The text ne ver suggests that audience members ar e disappointed because the y can ’t see the entir e production. In fact, it suggests that that’ s an impor tant par t of the experience. Choice D is incorr ect. The text doesn ’t mention a r ecommended itiner ary for audience members.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-8c1be131",
        "type": "Reading",
        "passage": "During the W orld W ar II er a, some Mexican American women adopted a striking new look called pachuca style. They wor e alter ed men ’s jack ets or z oot suits (wide-legged, long-coated suits) and dr amatic mak eup, and the y combed their hair int o high, r ounded shapes. Some people criticiz ed pachuca style, sa ying it was danger ous and women should dr ess tr aditionally . But hist orians see things diff erently . They see pachuca style as a form of r ebellion against the er a’s rigid social expectations for women. They say that it showed a desir e for self-expr ession and fr eedom on the par t of women who adopted the style.",
        "question": "Accor ding t o the text, how do hist orians view pachuca style?",
        "options": ["They think that pachuca style was such a popular tr end that it continues t o inﬂuence fashion in the United States t o the pr esent day.","They think that pachuca style was a wa y for some Mexican American women t o expr ess themselv es and r esist strict social expectations.","They think that pachuca style was celebr ated because it enabled some Mexican American women t o show their suppor t for the United States during W orld W ar II.","They think that pachuca style was similar t o other fashion tr ends that diff erent gr oups of women adopted in the same period."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a statement about how hist orians view pachuca style that is suppor ted b y the text. The text ﬁrst describes the distinctiv e pachuca style of dr ess adopted b y some Mexican American women during W orld W ar II, sa ying that some criticiz ed it and asser ted that women should dr ess tr aditionally . The text then goes on t o contr ast this position with that of hist orians, who \" see things diff erently \": accor ding t o these hist orians, the pachuca style showed a wish for fr eedom and self-expr ession, and it acted as a kind of r ebellion against what society expected of women at the time. Ther efore, accor ding to the text, hist orians think that the pachuca style was a wa y for Mexican women t o expr ess themselv es and r esist strict social expectations. Choice A is incorr ect because the text explicitly describes the pachuca style as a distinctiv e look adopted during the W orld W ar II era. It does not indicate that the pachuca style inﬂuences fashion in the United States in the pr esent da y. Choice C is incorr ect because the text does not indicate that Mexican American women wor e the pachuca style t o show suppor t for the United States during W orld W ar II; r ather , the style was a means of self-expr ession and r ebellion against social expectations. Choice D is incorr ect because the text does not compar e the pachuca style t o other fashion tr ends: the pachuca style is the only style mentioned.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-92c2564d",
        "type": "Reading",
        "passage": "Utah is home t o Pando, a colony of about 47,000 quaking aspen tr ees that all shar e a single r oot system. P ando is one of the largest single or ganisms b y mass on Ear th, but ecologists ar e worried that its gr owth is declining in par t because of gr azing b y animals. The ecologists sa y that str ong f ences could pr event deer fr om eating y oung tr ees and help P ando star t thriving again.",
        "question": "Accor ding t o the text, why ar e ecologists worried about P ando?",
        "options": ["It isn ’t growing at the same r ate it used t o.","It isn ’t producing y oung tr ees anymor e.","It can ’t grow int o new ar eas because it is block ed b y fences.","Its root system can ’t suppor t many mor e new tr ees."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it pr esents an explanation that is dir ectly stated in the text for why ecologists ar e worried about P ando. The text states that P ando is a colony of about 47,000 quaking aspen tr ees that r epresents one of the lar gest organisms on Ear th. Accor ding t o the text, ecologists ar e worried that P ando ’s growth is declining, par tly because animals ar e feeding on the tr ees. In other wor ds, the ecologists ar e worried that P ando isn ’t growing at the same r ate it used t o. Choice B is incorr ect. Rather than indicating that P ando isn ’t producing y oung tr ees anymor e, the text r eveals that P ando is indeed producing y oung tr ees, stating that those tr ees can be pr otected fr om gr azing deer b y str ong f ences. Choice C is incorr ect because the text states that f ences can be used t o prevent deer fr om eating P ando ’s young tr ees, not that P ando itself can ’t grow in new ar eas because it’ s block ed b y fences. Choice D is incorr ect because the text off ers no e vidence that P ando ’s root system is incapable of suppor ting new tr ees or is other wise a cause of worr y for ecologists.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-22e4d633",
        "type": "Reading",
        "passage": "Although many tr ansposons, DN A sequences that mo ve within an or ganism ’s genome thr ough shuﬄing or duplication, ha ve become corrupted and inactiv e over time, those fr om the long interspersed nuclear elements (LINE) family appear t o remain activ e in the genomes of some species. In humans, the y are functionally impor tant within the hippocampus, a br ain structur e that suppor ts complex cognitiv e processes. When the r esults of molecular analysis of two species of oct opus—an animal known for its intelligence—wer e announced in 2022, the conﬁrmation of a LINE tr ansposon in Octopus vulgaris and Octopus bimaculoides genomes pr ompted r esear chers t o hypothesiz e that that tr ansposon family is tied t o a species’ capacity for adv anced cognition.",
        "question": "Which ﬁnding, if true, would most dir ectly suppor t the r esear chers’ hypothesis?",
        "options": ["The LINE tr ansposon in O. vulgaris and O. bimaculoides genomes is activ e in an oct opus br ain structur e that functions similarly to the human hippocampus.","The human genome contains multiple tr ansposons fr om the LINE family that ar e all primarily activ e in the hippocampus.","A consistent number of copies of LINE tr ansposons is pr esent acr oss the genomes of most oct opus species, with f ew known corruptions.","O. vulgaris and O. bimaculoides have smaller br ains than humans do r elativ e to body siz e, but their genomes contain sequences fr om a wider v ariety of tr ansposon families."],
        "answer": 0,
        "explanation": "Choice A is the best answer . The text sa ys that LINE tr ansposons ar e impor tant in the human hippocampus, which suppor ts complex cognition. If the LINE tr ansposon found in oct opuses is activ e in a similar par t of their br ain, that would suggest that LINE transposons suppor t complex cognition in oct opuses t oo, which in turn suppor ts the hypothesis that LINE tr ansposons ar e link ed to adv anced cognition in gener al. Choice B is incorr ect. This choice doesn ’t suppor t the hypothesis. It doesn ’t include anything about how LINE tr ansposons function in species other than humans. Choice C is incorr ect. This choice doesn ’t suppor t the hypothesis. It doesn ’t include anything about how the LINE tr ansposon in oct opuses might suppor t adv anced cognition. Choice D is incorr ect. This choice doesn ’t suppor t the hypothesis. It doesn ’t include anything about how the LINE tr ansposon in oct opuses might suppor t adv anced cognition.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-458b4a11",
        "type": "Reading",
        "passage": "To understand how temper ature change aff ects micr oorganism-mediated cy cling of soil nutrients in alpine ecosystems, E va Kašt ovská et al. collected plant-soil cor es in the Tatra Mountains at ele vations ar ound 2,100 meters and tr ansplanted them t o elevations of 1,700–1,800 meters, wher e the mean air temper ature was warmer b y 2°C. Micr oorganism-mediated nutrient cy cling was acceler ated in the tr ansplanted cor es; crucially , micr oorganism community composition was unchanged, allowing Kašt ovská et al. t o attribute the acceler ation t o temper ature-induced incr eases in micr oorganism activity . It can most r easonably be inf erred fr om the text that the ﬁnding about the micr oorganism community composition was impor tant",
        "question": "for which r eason?",
        "options": ["It provided pr eliminar y evidence that micr oorganism-mediated nutrient cy cling was acceler ated in the tr ansplanted cor es.","It suggested that temper ature-induced changes in micr oorganism activity ma y be occurring at incr easingly high ele vations.","It ruled out a potential alternativ e explanation for the acceler ation in micr oorganism-mediated nutrient cy cling.","It clariﬁed that micr oorganism activity le vels in the plant-soil cor es varied depending on which micr oorganisms comprised the community ."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it accur ately describes why the ﬁnding about the micr oorganism community composition was impor tant. The text describes an experiment b y Eva Kašt ovská and her team in which the y collected plant-soil cor es at one elevation and tr ansplanted them t o sites at a lower ele vation, wher e the mean air temper ature was warmer . Kašt ovská and her team obser ved that micr oorganism-mediated nutrient cy cling was acceler ated in the tr ansplanted cor es and that \" crucially , micr oorganism community composition was unchanged, \" which allowed the team t o attribute the acceler ation t o changes in micr oorganism activity br ought about b y the diff erence in temper ature. This str ongly implies that the team wouldn ’t ha ve been able t o mak e that attribution other wise, meaning that a change in micr oorganism composition r epresented another possible explanation for the acceler ation that had t o be ruled out. Choice A is incorr ect. Although the text sa ys micr oorganism-mediated cy cling of soil nutrients incr eased in the tr ansplanted cor es, this is unr elated t o what’ s impor tant about the ﬁnding that the micr oorganism composition didn ’t change—that it allowed the team to attribute the change in activity solely t o the change in temper ature. Choice B is incorr ect. Although the text compar es activity in one cor e at two diff erent ele vations, the text doesn ’t addr ess changes in activity at v arious ele vations o ver time. Choice D is incorr ect. Although diff erent micr oorganisms lik ely exhibit diff erent le vels of activity , the text indicates that ther e was no change in micr oorganism composition, and ther e is nothing in the text about diff erent micr oorganisms ha ving diff erent activity le vels.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-0d7f4966",
        "type": "Reading",
        "passage": "Jean-Bernar d Car on and colleagues r ecently disco vered a cache of jellyﬁsh fossils in the Bur gess Shale, a site in the Canadian Rockies that is rich in fossils fr om the Cambrian period (o ver 500 million y ears ago). Car on and colleagues claim that these ar e the oldest jellyﬁsh fossils e ver disco vered. In the past twenty y ears, two sites in China and the United States ha ve yielded fossils of a similar age that some exper ts belie ve are most lik ely jellyﬁsh due t o their shapes and the appear ance of pr ojecting tentacles. But Caron and colleagues ar gue that the appar ent tentacles ar e in fact the comb r ows of ctenophor es, gelatinous animals that ar e only distantly r elated t o jellyﬁsh. Which statement, if true, would most dir ectly weak en the claim b y Car on and colleagues about the fossils found in China and the",
        "question": "United States?",
        "options": ["Sites in the Canadian Rockies fr om later periods than the Cambrian period ha ve yielded fossils that ha ve been conclusiv ely identiﬁed as ctenophor e fossils.","The fossils found in China and the United States ar e so poorly pr eser ved that though the y cannot be conclusiv ely identiﬁed as jellyﬁsh, the y cannot be conclusiv ely identiﬁed as ctenophor es either .","While ctenophor e fossils ha ve been disco vered in China and the United States, the y have never been disco vered in the Bur gess Shale.","The fossils disco vered b y Car on and colleagues in the Bur gess Shale wer e better pr eser ved than the fossils disco vered b y other r esear chers in China and the United States."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a statement that, if true, would most dir ectly weak en Car on and colleagues’ claim that the appar ent tentacles in the Chinese and American fossils ar e actually ctenophor e comb r ows. If the fossils ar e so poorly preser ved that the y cannot be conclusiv ely identiﬁed as either or ganism, neither the claim that the y are jellyﬁsh nor , as Car on claims, that the y are ctenophor es would be suppor ted. Choice A is incorr ect. Car on’s claim is that fossils fr om the US and China ar e ctenophor es, not jellyﬁsh. These fossils ar e said t o be \"of a similar age \" to the Cambrian fossils found in the Canadian Rockies. And nothing in the text or this choice suggests that the presence or absence of ctenophor es after the Cambrian would ha ve any bearing on whether the Cambrian fossils fr om the US and China ar e ctenophor es. Choice C is incorr ect. Car on’s claim is that fossils fr om the US and China ar e ctenophor es, not jellyﬁsh. Nothing in the text suggests that the pr esence or absence of ctenophor es in the Bur gess Shale (in Canada) would aff ect whether the fossils found in the US and China ar e ctenophor es. Choice D is incorr ect. Car on’s claim is that fossils fr om the US and China are ctenophor es, not jellyﬁsh. Although fossil quality is a plausible issue for the r esear ch described in the text, nothing in the text or this choice suggests that the fossils fr om US and China would ha ve been t oo poorly pr eser ved for pr oper identiﬁcation.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-3543e6e2",
        "type": "Reading",
        "passage": "The following text is fr om Jane A usten ’s 1811 no vel Sense and Sensibility . Elinor liv es with her y ounger sisters and her mother , Mrs. Dashwood. Elinor , this eldest daughter , whose advice was so eff ectual, possessed a str ength of understanding, and coolness of judgment, which qualiﬁed her , though only nineteen, t o be the counsellor of her mother , and enabled her fr equently t o counter act, t o the advantage of them all, that eagerness of mind in Mrs. Dashwood which must gener ally ha ve led t o imprudence. She had an excellent hear t;—her disposition was aff ectionate, and her f eelings wer e str ong; but she knew how t o go vern them: it was a knowledge which her mother had y et to learn; and which one of her sisters had r esolv ed ne ver to be taught.",
        "question": "Accor ding t o the text, what is true about Elinor?",
        "options": ["Elinor often ar gues with her mother but fails t o change her mind.","Elinor can be o verly sensitiv e with r egar d to family matters.","Elinor thinks her mother is a bad r ole model.","Elinor is r emarkably matur e for her age."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it pr ovides a detail about Elinor that is established in the text. The text indicates that although Elinor is “ only nineteen, ” she giv es good advice and exhibits such a high le vel of understanding and judgment that she serves as “the counsellor of her mother .” Thus, Elinor is matur e be yond her y ears. Choice A is incorr ect because it isn ’t suppor ted b y the text: although the text sa ys that Elinor advises her mother and often counter acts her mother ’s impulses, ther e’s no mention of Elinor ar guing with her mother or failing t o change her mother ’s mind. Choice B is incorr ect because it isn ’t suppor ted b y the text: although the text mentions that Elinor has str ong f eelings, it doesn ’t indicate that she ’s excessiv ely sensitiv e when it comes t o family issues. Choice C is incorr ect because it isn ’t suppor ted b y the text: ther e’s no mention of what Elinor thinks about her mother and no suggestion that she thinks her mother is a bad r ole model. Because she ’s described as ha ving “ an ex cellent hear t,” Elinor lik ely doesn ’t think ill of her mother .",
        "difficulty": "Medium"
    },
    {
        "id": "em1-75e07a4d",
        "type": "Reading",
        "passage": "Sample of F ood Items fr om Gemini Mission Menus Food item DayMeal Sugar cookie cubes 1 B Chick en and v egetables 2 B Shrimp cocktail 4 C Hot cocoa 3 A To mak e sur e the y got the nutrition the y needed while in space, the astr onauts of N ASA’s Gemini missions wer e giv en menus for three meals a da y (meals A, B, and C ) on a four-da y rotating schedule. Looking at the sample of food items fr om these menus, a student notes that on da y 1, the menu included ______",
        "question": "Which choice most eff ectiv ely uses data fr om the table t o complete the statement?",
        "options": ["shrimp cocktail for meal B.","hot cocoa for meal C.","sugar cookie cubes for meal B.","chick en and v egetables for meal A."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it most eff ectiv ely uses data fr om the table t o complete the statement. The table shows that on da y 1, the menu for N ASA’s Gemini missions included sugar cookie cubes for meal B. Choice A is incorr ect because accor ding t o the table, shrimp cocktail was ser ved on da y 4, not da y 1; mor eover, the item was served for meal C, not meal B, as this choice claims. Choice B is incorr ect because accor ding t o the table, hot cocoa was ser ved on da y 3, not on da y 1; mor eover, the item was ser ved for meal A, not for meal C, as this choice claims. Choice D is incorr ect because accor ding t o the table, chick en and v egetables wer e ser ved on da y 2, not on da y 1; mor eover, the item was ser ved for meal B, not for meal A, as this choice claims.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-1ba5ad7a",
        "type": "Reading",
        "passage": "Many liter ary theorists distinguish between fabula , a narr ative’s content, and syuzhet , a narr ative’s arr angement and pr esentation of events. In the ﬁlm The Godfather P art II, the fabula is the st ory of the Corleone family , and the syuzhet is the pr esentation of the story as it alternates between two timelines in 1901 and 1958. But liter ary theorist Mikhail Bakhtin maintained that fabula and syuzhet are insuﬃcient t o completely describe a narr ative—he held that systematic categorizations of ar tistic phenomena discount the subtle wa y in which meaning is cr eated b y inter actions between the ar tist, the work, and the audience.",
        "question": "Which choice best states the main idea of the text?",
        "options": ["Liter ary theorist Mikhail Bakhtin ar gued that ther e are impor tant char acteristics of narr atives that ar e not fully encompassed b y two concepts that other theorists ha ve used t o analyz e narr atives.","Liter ary theorist Mikhail Bakhtin claimed that meaning is not inher ent in a narr ative but is cr eated when an audience encounters a narr ative so that narr atives ar e interpr eted diff erently b y diff erent people.","The st orytelling methods used in The Godfather P art II may seem unusually complicated, but the y can be easily underst ood when two concepts fr om liter ary theor y are utiliz ed.","Narr atives that ar e told out of chr onological or der ar e mor e diﬃcult for audiences t o understand than ar e narr atives pr esented chronologically ."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most accur ately states the main idea of the text. The text begins b y explaining that many literary theorists r ely on the concepts of fabula (a narr ative’s content) and syuzhet (a narr ative’s arr angement and pr esentation of events) and illustr ates these concepts b y explaining how the y can be applied t o the ﬁlm The Godfather P art II. The text then discusses how Mikhail Bakhtin, a liter ary theorist, ar gued that fabula and syuzhet can’t fully describe a narr ative, since systematic categorizations such as these fail t o account for all the wa ys in which inter actions between the ar tist, the work, and the audience produce meaning. Thus, the main idea is that Bakhtin ar gued that ther e are impor tant char acteristics of narr atives that ar e not fully encompassed b y two concepts that other theorists ha ve used t o analyz e narr atives. Choice B is incorr ect because accor ding t o the text, Mikhail Bakhtin belie ved that meaning was cr eated thr ough the inter actions of the ar tist, narr ative, and audience, not simply thr ough the inter action between the audience and narr ative; mor eover, the text doesn ’t addr ess whether Bakhtin focused on the wa ys in which diff erent people interpr et narr atives diff erently . Choice C is incorr ect. Although the text implies that the st orytelling methods used in The Godfather P art II are complicated, it discusses the ﬁlm only t o illustr ate how the concepts of fabula and syuzhet may be applied t o a narr ative. The ﬁlm ’s storytelling methods ar en’t the primar y focus of the text. Choice D is incorr ect. The text discusses The Godfather P art II, whose narr ative doesn ’t adher e to a single chr onological or der, only t o illustr ate the concepts of fabula (a narr ative’s content) and syuzhet (a narr ative’s arr angement and pr esentation of e vents). The primar y focus of this text isn ’t the structur e of this ﬁlm or of other narr atives that ar e told out of chronological or der; mor eover, the text doesn ’t consider whether such structur es mak e it har der for audiences t o understand narratives.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-602b47c7",
        "type": "Reading",
        "passage": "Biologists ha ve predicted that bir ds’ f eather structur es vary with habitat temper ature, but this hadn ’t been tested in mountain envir onments. Ornithologist Sahas Bar ve studied f eathers fr om 249 songbir d species inhabiting diff erent ele vations—and thus experiencing diff erent temper atures—in the Himala ya Mountains. He found that f eathers of high-ele vation species not only ha ve a greater pr opor tion of warming downy sections t o ﬂat and smooth sections than do f eathers of low-ele vation species, but high- elevation species’ f eathers also tend t o be longer , providing a thick er la yer of insulation.",
        "question": "Which choice best states the main idea of the text?",
        "options": ["Barve’s inv estigation shows that some species of Himala yan songbir ds ha ve evolved feathers that better r egulate body temper ature than do the f eathers of other species, contr adicting pr evious pr edictions.","Barve found an association between habitat temper ature and f eather structur e among Himala yan songbir ds, lending new suppor t to a gener al pr ediction.","Barve disco vered that songbir ds ha ve adapted t o their envir onment b y growing f eathers without ﬂat and smooth sections, complicating an earlier hypothesis.","The r esults of Bar ve’s study suggest that the ability of bir ds to withstand cold temper atures is determined mor e str ongly b y feather length than f eather structur e, challenging an established belief."],
        "answer": 1,
        "explanation": "Choice B is the best answer . The text describes how Bar ve found an association between habitat temper ature and f eather structur e among Himala yan songbir ds, which suppor ts the gener al pr ediction that bir ds’ f eather structur es vary with habitat temper ature. Choice A is incorr ect. Bar ve’s study isn ’t said t o contr adict pr evious pr edictions. In fact, the study suppor ts the pr ediction described in the ﬁrst sentence, which is that bir ds’ f eather structur es vary with habitat temper ature. Choice C is incorr ect. Bar ve’s study isn ’t said t o “complicate an earlier hypothesis. ” In fact, the study suppor ts the earlier pr ediction described in the ﬁrst sentence, which is that bir ds’ f eather structur es vary with habitat temper ature. Choice D is incorr ect. The text doesn ’t compar e the impor tance of f eather length and f eather structur e, and it doesn ’t say that Bar ve’s study challenges any established beliefs. In fact, the study suppor ts the pr ediction described in the ﬁrst sentence, which is that bir ds’ f eather structur es vary with habitat temper ature.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-068f939b",
        "type": "Reading",
        "passage": "The ancient Gr eek concept of “ mimesis, ” a term used in the works of Plat o, Arist otle, and other Gr eek philosophers in discussions of representational ar t—visual, per formance, or liter ary art that aims t o depict the r eal world—is a foundational concept of the Western philosophy of aesthetics. Mimesis is typically tr anslated as “imitation ” in modern editions of ancient Gr eek texts, but scholar Stephen Halliwell warns that this is o verly r eductiv e: “imitation ” implies that ar t mer ely copies—and is thus b y deﬁnition entir ely deriv ative of—a r eality that exists outside and prior t o the work of ar t, and tr anslating “ mimesis” thusly obscur es the multifaceted wa ys in which the ancient Gr eeks underst ood the r elationship between ar t and r eality .",
        "question": "Which statement, if true, would most dir ectly suppor t the claim b y Halliwell pr esented in the text?",
        "options": ["One of the earliest appear ances of mimesis’ s root wor d, mimos , can be found in an ancient Gr eek tr agedy in r eference t o dramatic impersonation, and the mim- root came t o be gener ally associated with the musical and poetic ar ts by the ﬁfth centur y BCE.","Both Plat o’s and Arist otle’s theorizations of mimesis examine the psy chological eff ects that works of ar t induce in the viewer or listener .","Although se veral of Plat o’s earliest philosophical works discuss aesthetic ideas, the term “ mimesis” doesn ’t appear in Plat o’s discussions of ar t until Cratylus , a relativ ely late work.","Although Plat o’s writings typically char acteriz e representational ar t as an inf erior r eﬂection of the physical world, Arist otle suggests that mimesis can r efer to art’s capacity t o envision hypothetical conditions that could, but don ’t yet, exist."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it pr esents a statement that would suppor t Halliwell’ s claim that \"imitation \" is an o verly simpliﬁed tr anslation of the wor d \"mimesis\" in the context of ancient Gr eek philosophical discussions of r epresentational ar t and that, because it suggests a view of ar t as mer ely cop ying things that exist in r eality , the tr anslation obscur es the fact that Plat o, Arist otle, and other ancient Gr eeks underst ood the r elationship between ar t and r eality in v aried wa ys. If Plat o’s works tend t o treat representational ar t as an inf erior or inadequate r eﬂection of the physical world (consistent with the idea of mer e imitation), while Arist otle’s works suggest that the term \" mimesis\" can r efer to art’s ability t o show conditions that don ’t curr ently exist but could exist (going be yond imitation int o no vel cr eation), that e vidence would suppor t the claim that the term \" mimesis\" means mor e than just \"imitation \" and that ancient Gr eek philosophers held diff erent views of the r elationship between ar t and r eality . Choice A is incorr ect because information about the r oot wor d mimos ﬁrst being used in dr ama and the r oot mim - coming t o be associated with music and poetr y wouldn ’t indicate anything about the meaning of the speciﬁc term \" mimesis\" as it was used b y ancient Gr eek philosophers in discussions of r epresentational ar t; thus, the information would ha ve no bearing on Halliwell’ s claim that a common tr anslation of the speciﬁc term is an o versimpliﬁcation. Choice B is incorr ect because the issue of ar t’s psychological eff ects on audiences gets at how people r espond t o works of ar t instead of how ar t itself is r elated t o reality , so the idea that Plat o and Arist otle both addr essed such eff ects in their consider ations of mimesis wouldn ’t ha ve any bearing on Halliwell’ s claim that a common tr anslation of that term o versimpliﬁes the r elationship between ar t and r eality . Further, this idea would t ouch on one gener al similarity in appr oaches t o mimesis instead of illustr ating the multifaceted, or v aried, wa ys Halliwell claims ancient Gr eek philosophers underst ood ar t’s relation t o reality . Choice C is incorr ect because the idea that Plat o discussed aesthetics in his early works but didn ’t use the term \" mimesis\" until later doesn ’t giv e any indication of how Plat o or any other Command of EvidenceDiﬃculty common tr anslation of the term \" mimesis\" is o versimpliﬁed and fails t o reﬂect the v aried wa ys the philosophers underst ood that relationship.",
        "difficulty": "Hard"
    },
    {
        "id": "em1-702eb7e3",
        "type": "Reading",
        "passage": "200 150 100 50 0Uncertainty (larger values = more uncertainty) 2005 2006 2007 2008 2009 2010Economic Policy Uncertainty in the United Kingdom, 2005–2010 Year tax and public spending policy trade policy general economic policy High le vels of public uncer tainty about which economic policies a countr y will adopt can mak e planning diﬃcult for businesses, but measur es of such uncer tainty ha ve not tended t o be v ery detailed. Recently , howe ver, economist Sandile Hlatshwa yo analyz ed trends in news r epor ts to deriv e measur es not only for gener al economic policy uncer tainty but also for uncer tainty r elated t o speciﬁc ar eas of economic policy , like tax or tr ade policy . One r evelation of her work is that a gener al measur e ma y not fully r eﬂect uncer tainty about speciﬁc ar eas of policy , as in the case of the United Kingdom, wher e gener al economic policy uncer tainty ______",
        "question": "Which choice most eff ectiv ely uses data fr om the gr aph t o illustr ate the claim?",
        "options": ["aligned closely with uncer tainty about tax and public spending policy in 2005 but diff ered fr om uncer tainty about tax and public spending policy b y a lar ge amount in 2009.","was substantially lower than uncer tainty about tax and public spending policy each y ear fr om 2005 t o 2010.","reached its highest le vel between 2005 and 2010 in the same y ear that uncer tainty about tr ade policy and tax and public spending policy r eached their lowest le vels.","was substantially lower than uncer tainty about tr ade policy in 2005 and substantially higher than uncer tainty about tr ade policy in 2010."],
        "answer": 3,
        "explanation": "No explanation provided.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-29f5c8c2",
        "type": "Reading",
        "passage": "Fish whose DN A has been modiﬁed t o include genetic material fr om other species ar e known as tr ansgenic. Some tr ansgenic ﬁsh have genes fr om jellyﬁsh that r esult in ﬂuor escence (that is, the y glow in the dark). Although these ﬁsh wer e initially engineer ed for resear ch purposes in the 1990s, the y wer e sold as pets in the 2000s and can now be found in the wild in cr eeks in Br azil. A student in a biology seminar who is writing a paper on these ﬁsh asser ts that their escape fr om Br azilian ﬁsh farms int o the wild ma y have signiﬁcant negativ e long-term ecological eff ects.",
        "question": "Which quotation fr om a r esear cher would best suppor t the student’ s asser tion?",
        "options": ["“In one site in the wild wher e transgenic ﬁsh wer e obser ved, f emales outnumber ed males, while in another the numbers of females and males wer e equiv alent. ”","“Though some pr esence of tr ansgenic ﬁsh in the wild has been r ecor ded, ther e are insuﬃcient studies of the impact of those ﬁsh on the ecosystems int o which the y are intr oduced. ”","“The ecosystems int o which tr ansgenic ﬁsh ar e known t o ha ve been intr oduced ma y represent a subset of the ecosystems int o which the ﬁsh ha ve actually been intr oduced. ”","“Through interbr eeding, tr ansgenic ﬁsh might intr oduce the tr ait of ﬂuor escence int o wild ﬁsh populations, making those populations mor e vulner able t o predat ors.”"],
        "answer": 3,
        "explanation": "Choice D is the best answer because this quotation would best suppor t the student’ s asser tion that the escape of tr ansgenic ﬁsh from Br azilian ﬁsh farms int o the wild ma y have signiﬁcant negativ e long-term ecological eff ects. The text explains that tr ansgenic ﬁsh ha ve DN A that includes genetic material fr om other species, that some tr ansgenic ﬁsh ha ve genes fr om jellyﬁsh that mak e them glow in the dark, and that glow-in-the-dark tr ansgenic ﬁsh can now be found in the wild in Br azilian cr eeks. The quotation indicates why the escape of these ﬁsh ma y have negativ e long-term ecological eff ects: glow-in-the-dark tr ansgenic ﬁsh might introduce ﬂuor escence int o wild ﬁsh populations b y breeding with wild ﬁsh, causing wild ﬁsh t o glow in the dark and ther eby allowing pr edat ors t o prey on them much mor e easily . Choice A is incorr ect because this quotation doesn ’t mention any negativ e eff ects of the intr oduction of ﬂuor escent tr ansgenic ﬁsh int o the wild. The quotation mer ely compar es the r atio of f emales t o males at two sites in the wild wher e transgenic ﬁsh ha ve been obser ved. Choice B is incorr ect because this quotation doesn ’t suppor t the idea that the escape of ﬂuor escent tr ansgenic ﬁsh fr om Br azilian ﬁsh farms ma y have signiﬁcant negativ e long-term ecological eff ects. Rather , the quotation suggests that mor e resear ch is needed t o understand the eff ects. Choice C is incorr ect because this quotation suppor ts the idea that tr ansgenic ﬁsh may be pr esent in mor e ecosystems than has been obser ved; it doesn ’t addr ess whether the pr esence of ﬂuor escent tr ansgenic ﬁsh aff ects these ecosystems.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-1281df d5",
        "type": "Reading",
        "passage": "9 8 7 6 5 4 3 2 1 0Number of lizard species 30–39 40–49 50–59 60–69 70–79 80–89 90–100Number of Lizard Species by Average Percent of Maximal Speed Used When Pursuing Prey or Escaping Predators Percent of maximal speed escaping pursuing It ma y seem that the optimal str ategy for an animal pursuing pr ey or escaping pr edat ors is t o mo ve at maximal speed, but the ener gy expense of exploiting full speed capacity can disfa vor such a str ategy e ven in escape contexts, as e videnced b y the fact that ______",
        "question": "Which choice most eff ectiv ely uses data fr om the gr aph t o complete the text?",
        "options": ["most lizar d species use about the same per centage of their maximal speed when escaping pr edation as the y do when pursuing pr ey.","multiple lizar d species mo ve at an a verage of less than 90% of their maximal speed while escaping pr edation.","more lizar d species use, on a verage, 90%–100% of their maximal speed while escaping pr edation than use any other percentage of their maximal speed.","at least 4 lizar d species use, on a verage, less than 100% of their maximal speed while pursuing pr ey."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it describes data fr om the gr aph that complete the text’ s discussion of lizar d species’ use of maximal speed when escaping pr edat ors. Accor ding t o the text, mo ving at maximal speed (the highest speed possible) r equir es so much ener gy that it is not alwa ys an eff ectiv e str ategy for animals, e ven when the y are escaping pr edat ors. The gr aph displa ys data on the a verage per cent of maximal speed used b y lizar d species while either escaping pr edat ors or pursuing pr ey. The gr aph Command of EvidenceDiﬃculty maximal speed, 50%–59% of maximal speed, 60%–69% of maximal speed, 70%–79% of maximal speed, 80%–89% of maximal speed, and 90%–100% of maximal speed, r espectiv ely. In the gr aph, ther e is at least one species in each of the following per cent categories for maximal speed while escaping pr edat ors: 50%–59%, 60%–69%, 70%–79%, and 80%–89%. Thus, the data in the graph show that multiple lizar d species mo ve at an a verage of less than 90% of their maximal speed while escaping pr edation. Choice A is incorr ect because the data in the gr aph isn ’t organiz ed in such a wa y that a comparison of the per centage of maximal speed used when escaping pr edation with the per centage used when pursuing pr ey is possible at the le vel of individual species. Choice C is incorr ect. It is true that in the gr aph, the per cent categor y with the lar gest number of species using maximal speed while escaping pr edat ors is 90%–100% (8 species t otal). Howe ver, these data don ’t complete the text, which is concerned instead with how animals ar e discour aged fr om using maximal speed e ven when escaping pr edat ors because of the amount of ener gy requir ed to use it. Choice D is incorr ect because these data fr om the gr aph per tain t o maximal speed while pursuing pr ey and therefore don ’t complete the text’ s discussion of lizar d species’ use of maximal speed when escaping pr edat ors.",
        "difficulty": "Hard"
    },
    {
        "id": "em1-d83c3d54",
        "type": "Reading",
        "passage": "140,000 120,000 100,000 80,000 60,000 40,000 20,000 0Area (square meters) 1987 1993 2006Characteristics of the Banks of the Provo River Downstream of the Jordanelle Dam Year grass cover bare soil forest cover The Jor danelle Dam was built on the Pr ovo Riv er in Utah in 1992. Ear th scientist Adriana E. Mar tinez and colleagues tr acked changes t o the envir onment on the banks of the riv er downstr eam of the dam, including how much gr ass and for est co ver wer e present. They concluded that the dam changed the ﬂow of the riv er in wa ys that beneﬁted gr ass plants but didn ’t beneﬁt tr ees.",
        "question": "Which choice best describes data fr om the gr aph that suppor t Mar tinez and colleagues’ conclusion?",
        "options": ["The lowest amount of gr ass co ver was appr oximately 58,000 squar e meters, and the highest amount of for est co ver was appr oximately 75,000 squar e meters.","Ther e was mor e grass co ver than for est co ver in 1987, and this diff erence incr eased dr amatically in 1993 and again in 2006.","Ther e was less gr ass co ver than bar e soil in 1987 but mor e grass co ver than bar e soil in 1993 and 2006, wher eas ther e was more for est co ver than bar e soil in all thr ee years.","Grass co ver incr eased fr om 1987 t o 1993 and fr om 1993 t o 2006, wher eas for est co ver decr eased in those periods."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it describes data fr om the gr aph that suppor t Mar tinez and colleagues’ conclusion that the Jordanelle Dam led t o changes that beneﬁted gr ass plants but not tr ees. The gr aph shows char acteristics of the banks of the Command of EvidenceDiﬃculty amount of gr ass co ver, bar e soil, and for est co ver in those y ears. The text indicates that the Jor danelle Dam was built in 1992, meaning that the data fr om the gr aph for 1987 r eﬂect conditions befor e the dam was built, wher eas the data for 1993 and 2006 reﬂect conditions after the dam was built. The data show that gr ass co ver incr eased substantially fr om 1987 t o 1993 and again from 1993 t o 2006. The data also show that for est co ver declined o ver those periods. Together , these data suppor t Mar tinez and colleagues’ conclusion that the dam was beneﬁcial for gr ass plants but not for tr ees—gr ass co ver incr eased signiﬁcantly after the dam was built, while for est co ver declined. Choice A is incorr ect. Although it is true that, in the gr aph, the lowest v alue for gr ass co ver is appr oximately 58,000 squar e meters and the highest v alue for for est co ver is appr oximately 75,000 squar e meters, both v alues ar e from 1987, befor e the Jor danelle Dam was built in 1992. Ther efore, this information alone cannot suppor t Mar tinez and colleagues’ conclusion about changes in grass and tr ee co ver following the construction of the dam. Choice B is incorr ect because it pr esents an inaccur ate description of data fr om the gr aph. The gr aph shows that ther e was mor e for est co ver than gr ass co ver in 1987, not that ther e was mor e grass cover than for est co ver that y ear. Choice C is incorr ect because, while it accur ately r eﬂects data fr om the gr aph when it compar es grass co ver and for est co ver to bar e soil, these data alone cannot suppor t Mar tinez and colleagues’ conclusion that the dam led t o changes that beneﬁted gr ass plants but not tr ees. An incr ease in gr ass co ver relativ e to bar e soil following the construction of the dam might indicate that the dam beneﬁted gr ass plants, but the fact that ther e was mor e for est co ver than bar e soil in all thr ee years doesn ’t indicate that the dam failed t o beneﬁt tr ees.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-ca5a3fb4",
        "type": "Reading",
        "passage": "The pr actice of logging (cutting down tr ees for commer cial and other uses) is often thought t o be at odds with for est conser vation (the work of pr eser ving for ests). Howe ver, a massiv e study in for est management and pr eser vation spanning 700,000 hectar es in Oregon ’s Malheur National F orest calls that view int o question. So far , results of the study suggest that for est plots that ha ve under gone limited logging (the car eful r emo val of a contr olled number of tr ees) ma y be mor e robust than plots that ha ven’t been logged at all. These r esults, in turn, suggest that ______",
        "question": "Which choice most logically completes the text?",
        "options": ["logging ma y be useful for maintaining healthy for ests, pr ovided it is limited.","other for est management str ategies ar e mor e eff ectiv e than limited logging.","as time passes, it will be diﬃcult t o know whether limited logging has any beneﬁts.","the best wa y to suppor t forest health ma y be t o lea ve lar ge for ests entir ely unt ouched."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most logically completes the text’ s discussion of the potential eff ects of logging on for est conser vation. The text begins b y stating that logging pr actices ar e often thought of as being contr ary to for est conser vation effor ts. Then, the text pr esents the r esults of a r esear ch study examining the eff ect of limited logging pr actices on speciﬁc for est plots, ﬁnding that the plots with limited logging ma y be \" more robust\" (healthier) than the plots that hadn ’t been logged at all. Giv en these r esults, it follows that logging ma y be a useful pr actice for maintaining healthy for ests if it is pr acticed in a limited wa y. Choice B is incorr ect because the study r eferenced in the text only pr ovides information on limited logging as a potential for est management str ategy . Ther e is no information in the text about how other for est management str ategies suppor t forest conser vation effor ts. Ther efore, the text does not suppor t the asser tion that other for est management str ategies ar e mor e successful than limited logging. Choice C is incorr ect because the text pr esents a r esear ch study with ﬁndings that speciﬁc plots of for est with limited logging ma y be mor e robust than the for est plots that wer e not logged. Rather than suggesting that it is har d to know whether limited logging might be beneﬁcial, the text suggests that the pr actice could be useful in for est conser vation effor ts. Choice D is incorr ect. The text discusses the r esults of a r esear ch study that compar es the health of for est plots with limited logging t o for est plots that wer e not logged. It does not tak e a position on the best wa y to suppor t forest health but r ather presents a r esear ch study with ﬁndings that question conv entionally held thoughts r egar ding the pr actice of logging.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-98d0a5d7",
        "type": "Reading",
        "passage": "Almost all works of ﬁction contain r eferences t o the pr ogression of time, including the time of da y when e vents in a st ory tak e place. In a 2020 study , Allen Kim, Charuta P ethe, and Ste ven Skiena claim that an obser vable pattern in such r eferences r eﬂects a shift in human beha vior pr ompted b y the spr ead of electric lighting in the late nineteenth centur y. The r esear chers dr ew this conclusion fr om an analysis of mor e than 50,000 no vels spanning many centuries and cultur es, using softwar e to recogniz e and tally both speciﬁc time r eferences—that is, clock phr ases, such as 7 a.m. or 2:30 p.m. —and implied ones, such as mentions of meals typically associated with a par ticular time of da y.",
        "question": "Which ﬁnding fr om the study , if true, would most dir ectly suppor t the r esear chers’ conclusion?",
        "options": ["Novels published after the y ear 1800 include the clock phr ase 10 a.m. less often than no vels published befor e the y ear 1800 do.","Novels published after 1880 contain signiﬁcantly mor e references t o activities occurring after 10 p.m. than do no vels fr om earlier periods.","Among no vels published in the nineteenth centur y, implied time r eferences become steadily mor e common than clock phr ases as publication dates appr oach 1900.","The time r eferences of noon (12 p.m. ) and midnight (12 a.m. ) are used with r oughly the same fr equency in the no vels."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a ﬁnding that, if true, would most dir ectly suppor t the r esear chers’ conclusion that an obser vable pattern in time r eferences in no vels r eﬂects a shift in human beha vior pr ompted b y the spr ead of electric lighting in the late nineteenth centur y. If no vels published after 1880 contain signiﬁcantly mor e references t o activities occurring after 10 p.m. than no vels fr om earlier periods do, this would suggest a change in human beha vior and daily r outines enabled b y the availability of electric lighting. Befor e electric lighting—which pr ovided illumination mor e easily than other a vailable forms of light— many activities ceased after nightfall, so r eferences t o late-night activities would be less common in earlier no vels. An incr ease in such r eferences after 1880 would align with the r esear chers’ conclusion, r eﬂecting an incr ease in late-night activities made possible b y electric lighting. Choice A is incorr ect because a decr ease in r eferences t o 10 a.m. after the y ear 1800 would not suppor t the r esear chers’ conclusion inv olving a shift in human beha vior pr ompted b y the spr ead of electric lighting t owar d the end of the 1800s. The time of 10 a.m. is in the morning and, in most places, char acteriz ed b y daylight, so a change in r eferences t o that time would not be clearly link ed to the impact of electric lighting. Choice C is incorr ect because while an incr ease in implied time r eferences r elativ e to clock phr ases in nineteenth-centur y novels could suggest a change in writing style or conv entions, it does not dir ectly suppor t the conclusion inv olving a shift in human beha vior pr ompted b y the spr ead of electric lighting. The text indicates that the resear chers’ conclusion is based on the content of the time r eferences themselv es, not the phr asing used. Choice D is incorr ect. If references t o noon and midnight ar e used with r oughly the same fr equency in all the no vels analyz ed b y the r esear chers, this would r eﬂect a lack of change in human beha vior with r egar d to time and ther efore would not suppor t the r esear chers’ conclusion involving a shift in human beha vior that occurr ed in r esponse t o the spr ead of electric lighting.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-cf956802",
        "type": "Reading",
        "passage": "When fashion designer Llo yd Henri Kiv a New opened his st ore in Scottsdale, Ariz ona, in 1945, he quickly became known for creating delicately cr afted leather goods, lik e belts and hats. He was perhaps most r enowned for his color ful handbags, which he made b y hand using a long and painstaking pr ocess. As he gained mor e cust omers, New began using sewing machines and other tools t o help him pr oduce bags mor e eﬃciently , though he continued t o handcr aft the crucial details that made each bag unique.",
        "question": "Based on the text, what would ha ve been the most lik ely consequence if New had not begun using sewing machines?",
        "options": ["He would ha ve been unable t o ensur e that each bag included unique, handcr afted details.","He would ha ve struggled t o meet the incr easing demand for his bags.","He would ha ve had t o individually design each bag he pr oduced.","He would not ha ve been able t o gener ate as much inter est in his bags."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents the most lik ely consequence if New had not begun using sewing machines. The text states that New gained new cust omers and that sewing machines allowed him t o mak e bags mor e eﬃciently , or in less time than he could when sewing b y hand. It’ s reasonable t o conclude that if New hadn ’t reduced the time it t ook t o mak e each bag b y starting t o use sewing machines, it would ha ve been har d for him t o keep up with the incr eased demand. Choice A is incorr ect because the text indicates that New added unique, handcr afted details t o his bags befor e he star ted using sewing machines and continued t o do so after he star ted using them. Choice C is incorr ect because the text doesn ’t suggest that individually designing each bag would ha ve been a consequence of not using sewing machines, since New was alr eady designing unique details for each bag befor e he star ted using sewing machines and continued t o do so after he star ted using them. Choice D is incorr ect because the text indicates that people wer e alr eady inter ested in New’ s bags befor e he star ted using sewing machines. Rather than allowing New t o gener ate mor e inter est in his bags, sewing machines helped New k eep up with the inter est that had alr eady gr own.",
        "difficulty": "Medium"
    },
    {
        "id": "em1-95388117",
        "type": "Reading",
        "passage": "Land Ar ea Co vered b y Nativ e Flowering Plants at a Site in Antar ctica SpeciesArea co vered in 2009 (in squar e meters)Area co vered in 2018 (in squar e meters)Percent incr ease in ar ea co vered from 2009 t o 2018 Deschampsia antar ctica1,230 1,576 28% Colobanthus quitensis6.9 10.7 55% The only ﬂowering plant species nativ e to Antar ctica, Colobanthus quitensis and Deschampsia antar ctica  grow in places wher e the earth remains fr ee of ice for much of the y ear. Botanist Niccoletta Cannone wonder ed how the warming of Antar ctica ’s climate in recent y ears had aff ected these species, so she visited a site in Antar ctica, ﬁrst in 2009 and later in 2018, t o count the number of plants gr owing ther e. Cannone found that the ar ea of land co vered b y the two species had signiﬁcantly expanded during the nine- year period. While both species lik ely beneﬁted fr om warming temper atures, Colobanthus quitensis ______",
        "question": "Which choice most eff ectiv ely uses data fr om the table t o complete the comparison?",
        "options": ["suppr essed the gr owth of Deschampsia antar ctica , which co vered a smaller ar ea of land in 2018 than it had in 2009.","saw a gr eater expansion than Deschampsia antar ctica did, incr easing the ar ea of land it co vered b y mor e than half.","showed a gr eater incr ease in the a verage siz e of individual plants than Deschampsia antar ctica did.","covered land newly fr eed fr om ice at a r ate 55% faster than that of Deschampsia antar ctica ."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it most eff ectiv ely uses data fr om the table t o complete the comparison of how Colobanthus quitensis beneﬁted fr om warming temper atures with how Deschampsia antar ctica beneﬁted fr om them. The table shows the land area co vered b y these two plant species at a site in Antar ctica. Accor ding t o the table, Colobanthus quitensis incr eased the ar ea it covered b y 55% fr om 2009 t o 2018, wher eas Deschampsia antar ctica incr eased the ar ea it co vered b y 28% during the same period. It ther efore follows that Colobanthus quitensis saw a gr eater expansion than Deschampsia antar ctica did and that Colobanthus quitensis incr eased the ar ea of land it co vered b y mor e than half. Choice A is incorr ect because accor ding t o the table, Deschampsia antar ctica covered 1,230 squar e meters of land in 2009 and 1,576 squar e meters of land in 2018. Deschampsia antar ctica ther efore co vered a lar ger, not a smaller , area of land in 2018 than in 2009. Mor eover, ther e’s no information in the text or the table that suggests that one species of the plant suppr essed the other . Choice C is incorr ect because it inaccur ately describes the data in the table. The table shows the land ar ea co vered b y Colobanthus quitensis and Deschampsia antar ctica and the per cent incr ease in ar ea co vered b y the two species fr om 2009 t o 2018, not the a verage siz e of individual plants belonging t o the two species. The data in the table ther efore can ’t be used t o mak e a comparison of the incr ease in individual plants’ a verage siz e. Choice D is incorr ect because the table shows the land ar ea covered b y Colobanthus quitensis and Deschampsia antar ctica and the per cent incr ease in ar ea co vered b y the two species fr om 2009 t o 2018, not the r ate at which the species incr eased the ar ea the y covered. Mor eover, ther e’s nothing in the table or the text Command of EvidenceDiﬃculty",
        "difficulty": "Medium"
    },
    {
        "id": "em1-403fb4e4",
        "type": "Reading",
        "passage": "60 55 50 45 40 35 30 25 20 15 10 5 0Female farmers as a percentage of total north Ondo central Ondo south OndoPercentage of Ondo State Small-Scale Farmers Who Are Female, by Main Crop Grown Ondo State region cereals root crops non–root vegetables Geogr apher Adeba yo Oluwole Eludo yin and his colleagues sur veyed small-scale farmers in thr ee locations in Ondo State, Nigeria— which has mountainous terr ain in the nor th, an urbaniz ed center , and coastal terr ain in the south—t o learn mor e about their practices, lik e the types of cr ops the y mainly cultiv ated. In some r egions, f emale farmers wer e found t o be especially pr ominent in the cultiv ation of speciﬁc types of cr ops and e ven constituted the majority of farmers who cultiv ated those cr ops; for instance, ______",
        "question": "Which choice most eff ectiv ely uses data fr om the gr aph t o complete the example?",
        "options": ["most of the farmers who mainly cultiv ated cer eals and most of the farmers who mainly cultiv ated non–r oot v egetables in south Ondo wer e women.","more women in centr al Ondo mainly cultiv ated r oot cr ops than mainly cultiv ated cer eals.","most of the farmers who mainly cultiv ated non–r oot v egetables in nor th and south Ondo wer e women.","a relativ ely equal pr opor tion of women acr oss the thr ee regions of Ondo mainly cultiv ated cer eals."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it uses data fr om the gr aph t o eff ectiv ely complete the example of Eludo yin and his colleagues’ ﬁndings concerning f emale farmers in some r egions of Ondo State, Nigeria. The gr aph pr esents v alues for the percentage of Ondo State small-scale farmers who ar e female, b y type of cr op and r egion. The gr aph shows that of the farmers mainly cultiv ating non-r oot v egetables, appr oximately 57% in nor th Ondo and appr oximately 54% in south Ondo ar e female; in other wor ds, most of those farmers ar e female, which ex empliﬁes the idea that f emale farmers mak e up the majority (mor e than half) of the farmers cultiv ating speciﬁc types of cr ops in some r egions. Choice A is incorr ect because it inaccur ately cites data fr om the gr aph: the gr aph shows that in south Ondo, most of the farmers mainly cultiv ating non-r oot v egetables ar e women (appr oximately 54%), but that only about 35% (less than half ) of the farmers mainly cultiv ating cer eals ar e women. Choice B is incorr ect because it inaccur ately cites data fr om the gr aph: the gr aph shows that mor e women in centr al Ondo mainly cultiv ate cer eals than mainly cultiv ate r oot cr ops (appr oximately 36% and 20%, respectiv ely). Additionally , it doesn ’t eff ectiv ely complete the example because the gr aph shows that f emale farmers don ’t mak e up the majority (mor e than half ) of the farmers for any type of cr op in centr al Ondo. Choice D is incorr ect because it doesn ’t effectiv ely complete the example; it simply states that a r elativ ely equal pr opor tion of women acr oss the thr ee regions mainly cultiv ate cer eals, which doesn ’t addr ess the v alue for that pr opor tion and thus doesn ’t show that a majority (mor e than half ) of the farmers cultiv ating cer tain cr ops ar e female.",
        "difficulty": "Hard"
    },
    {
        "id": "em1-3091f805",
        "type": "Reading",
        "passage": "Ochr e sea stars liv e in tidal pools along the shor eline of the P aciﬁc Ocean. A t night, the y mo ve to higher shor e levels in sear ch of prey. But scientists Cor ey Garza and Carlos Robles noticed that ochr e sea stars sta yed at lower le vels at night after hea vy rains. Garza and Robles hypothesiz ed that a la yer of fr esh water formed b y rainfall was a barrier t o the sea stars. To test their hypothesis, the scientists did an experiment. They placed some sea stars in a climbable tank of seawater and other sea stars in a similar tank of seawater with a la yer of fr esh water on t op. Then, the scientists watched the sea stars’ beha vior at night.",
        "question": "Which ﬁnding fr om the experiment, if true, would most dir ectly suppor t Garza and Robles’ s hypothesis?",
        "options": ["None of the sea stars climbed t o the t ops of the tanks, but sea stars in the tank with only seawater mo ved ar ound the bott om of the tank mor e than sea stars in the other tank did.","Sea stars in the tank with only seawater climbed t o the t op of the tank, but sea stars in the other tank st opped climbing just below the la yer of fr esh water .","Both gr oups of sea stars climbed t o the t ops of the tanks, but sea stars in the tank with only seawater climbed mor e slowly than sea stars in the other tank did.","Sea stars in the tank with only seawater mostly sta yed near the bott om of the tank, but sea stars in the other tank climbed int o the la yer of fr esh water ."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a ﬁnding that, if true, would suppor t Garza and Robles’ s hypothesis that a la yer of fresh water forms a barrier t o ochr e sea stars. The text explains that the sea stars tend t o mo ve to higher shor e levels at night in sear ch of pr ey, but after a hea vy rain, the sea stars sta y at lower shor e levels. Garza and Robles hypothesiz e that r ainfall r esults in a layer of fr esh water that the sea stars don ’t cross. To determine whether fr esh water forms a barrier t o sea stars, Garza and Robles obser ved how sea stars beha ved in a tank of only seawater and in a tank of seawater with a la yer of fr esh water on t op. If the sea stars climbed t o the t op of the tank with only seawater but st opped climbing just below the la yer of fr esh water in the other tank, that would suggest that fr esh water does indeed ser ve as a barrier t o the sea stars, ther eby suppor ting Garza and Robles’ s hypothesis. Choice A is incorr ect because ﬁnding that sea stars in the tank with only seawater mo ved ar ound the bott om of the tank mor e than sea stars in the other tank did but that none of the stars in either tank climbed t o the t op would be irr elevant t o Garza and Robles’ s hypothesis. Such a ﬁnding would r eveal nothing about whether fr esh water ser ves as a barrier t o sea stars. Choice C is incorr ect because ﬁnding that sea stars climbed t o the t op of both tanks would weak en, not suppor t, Garza and Robles’ s hypothesis, since it would indicate that the la yer of fr esh water wasn ’t a barrier t o the sea stars. Choice D is incorr ect because ﬁnding that sea stars in the tank with only seawater mostly sta yed near the bott om of the tank but sea stars in the other tank climbed int o the la yer of fr esh water wouldn ’t suppor t Garza and Robles’ s hypothesis. Instead, such a ﬁnding would suggest that the la yer of fr esh water wasn ’t a barrier t o the sea stars, ther eby weak ening Garza and Robles’ s hypothesis.",
        "difficulty": "Medium"
    }
];

const englishModule2: Question[] = [
    {
        "id": "em2-94c54577",
        "type": "Reading",
        "passage": "While attending school in New Y ork City in the 1980s, Okwui Enwez or encounter ed few works b y African ar tists in exhibitions, despite New Y ork’s reputation as one of the best places t o view contempor ary art from ar ound the world. Accor ding t o an ar ts journalist, later in his car eer as a r enowned cur ator and ar t hist orian, Enwez or sought t o remedy this deﬁciency , not b y focusing solely on modern African ar tists, but b y showing how their work ﬁts int o the lar ger context of global modern ar t and ar t hist ory.",
        "question": "Which ﬁnding, if true, would most dir ectly suppor t the journalist’ s claim?",
        "options": ["As cur ator of the Haus der K unst in Munich, Germany , Enwez or or ganiz ed a r etrospectiv e of Ghanaian sculpt or El Anatsui’ s work entitled El Anatsui: Triumphant Scale , one of the lar gest ar t exhibitions de voted t o a Black ar tist in E urope’s hist ory.","In the exhibition Postwar: Ar t Between the P aciﬁc and the A tlantic, 1945–1965 , Enwez or and cocur ator Katy Siegel br ought works b y African ar tists such as Malangatana Ngweny a together with pieces b y major ﬁgur es fr om other countries, lik e US artist Andy W arhol and Mexico ’s Da vid Siqueir os.","Enwez or’s work as cur ator of the 2001 exhibition The Shor t Centur y: Independence and Liber ation Mo vements in Africa, 1945– 1994 showed how African mo vements for independence fr om E uropean colonial powers following the Second W orld W ar profoundly inﬂuenced work b y African ar tists of the period, such as Kamala Ibr ahim Ishaq and Thomas Mukar obgwa.","Enwez or or ganiz ed the exhibition In/sight: African Phot ographers, 1940 t o the Pr esent not t o emphasiz e a par ticular aesthetic trend but t o demonstr ate the br oad r ange of wa ys in which African ar tists ha ve appr oached the medium of phot ography ."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a ﬁnding that, if true, would most dir ectly suppor t the ar ts journalist’ s claim about Enwez or’s work as a cur ator and ar t hist orian. In the text, the ar ts journalist asser ts that Enwez or wished not just t o focus on modern African ar tists but also t o show “how their work ﬁts int o the lar ger context of global modern ar t and ar t hist ory,” or how their work r elates t o artistic de velopments and work b y other ar tists elsewher e in the world. The description of Postwar: Ar t Between the P aciﬁc and the A tlantic, 1945–1965 indicates that Enwez or and Siegel’ s exhibition br ought works b y African ar tists together with works b y artists fr om other countries, thus suppor ting the ar ts journalist’ s claim that Enwez or sought t o show works by African ar tists in a context of global modern ar t and ar t hist ory. Choice A is incorr ect because it describes a r etrospectiv e that wouldn ’t suppor t the ar ts journalist’ s claim that Enwez or wanted t o show how works b y modern African ar tists ﬁt int o the lar ger context of global modern ar t and ar t hist ory. The description of El Anatsui: Triumphant Scale indicates that the r etrospectiv e focused only on the work of a single African ar tist, El Anatsui. The description doesn ’t suggest that the exhibition showed how El Anatsui’ s works ﬁt int o a global ar tistic context. Choice C is incorr ect because it describes an exhibition that wouldn ’t suppor t the ar ts journalist’ s claim that Enwez or wanted t o show how works b y modern African ar tists r elate t o the lar ger context of global modern ar t and ar t hist ory. The description of The Shor t Centur y: Independence and Liber ation Mo vements in Africa, 1945–1994 indicates that the exhibition showed how African ar tists were inﬂuenced b y mo vements for independence fr om E uropean colonial powers following the Second W orld W ar. Although this suggests that Enwez or intended the exhibition t o place works b y African ar tists in a political context, it doesn ’t indicate that the works wer e placed in a global ar tistic context. Choice D is incorr ect because it describes an exhibition that wouldn ’t suppor t the arts journalist’ s claim that Enwez or wanted t o show how works b y modern African ar tists r elate t o the lar ger context of global Command of EvidenceDiﬃculty intended t o reveal the br oad r ange of appr oaches tak en b y African phot ographers, not that the exhibition showed how phot ography b y African ar tists ﬁts int o a global ar tistic context.",
        "difficulty": "Hard"
    },
    {
        "id": "em2-ce4448b7",
        "type": "Reading",
        "passage": "Resear chers r ecently found that disruptions t o an enjo yable experience, lik e a shor t series of adv ertisements during a tele vision show , often incr ease viewers’ r epor ted enjo yment. Suspecting that disruptions t o an unpleasant experience would ha ve the opposite eff ect, the r esear chers had par ticipants listen t o construction noise for 30 minutes and anticipated that those whose listening experience was fr equently interrupted with shor t breaks of silence would thus ______",
        "question": "Which choice most logically completes the text?",
        "options": ["ﬁnd the disruptions mor e irritating as time went on.","rate the listening experience as mor e negativ e than those whose listening experience was uninterrupted.","rate the experience of listening t o construction noise as lasting for less time than it actually lasted.","perceive the v olume of the construction noise as gr owing softer o ver time."],
        "answer": 1,
        "explanation": "Choice B is the best answer . It most logically completes the text. The text tells us that disruptions t o an enjo yable experience increase viewers’ enjo yment. It also sa ys that r esear chers suspect the opposite is true for disruptions t o an unpleasant experience. Thus, we can inf er that the r esear chers expect t o ﬁnd that the interrupted unpleasant experience was worse for listeners than the uninterrupted unpleasant experience. Choice A is incorr ect. It doesn ’t logically complete the text. The text ne ver mak es any claims about how irritating the disruptions themselv es ar e per ceived to be. Rather , the text sa ys that pleasant experiences ar e per ceived as mor e enjo yable with interruptions, and that the opposite is suspected t o be true of unpleasant experiences. Choice C is incorr ect. It doesn ’t logically complete the text. The text ne ver mak es any claims about how long any experience is per ceived to be. Rather , the text sa ys that pleasant experiences ar e per ceived as mor e enjo yable with interruptions, and that the opposite is suspected t o be true of unpleasant experiences. Choice D is incorr ect. It doesn ’t logically complete the text. The text ne ver mak es any claims about how interruptions affect the per ceived volume of the unpleasant or pleasant experience. Rather , the text sa ys that pleasant experiences ar e perceived as mor e enjo yable with interruptions, and that the opposite is suspected t o be true of unpleasant experiences.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-0147b080",
        "type": "Reading",
        "passage": "Pyramids in E gypt and the Americas Pyramid Countr yHeight (meters) Age (y ears befor e present) The Gr eat P yramid Mexico 33 2,050 t o 2,400 The P yramid of Djoser Egypt 60 4,600 t o 4,700 The P yramid of Sahur eEgypt 47 4,400 t o 4,500 El Castillo Beliz e 40 1,100 t o 1,400 A student is writing an essa y about four p yramids for a hist ory class and wants t o note how long ago each p yramid was built and how tall each p yramid is. Consulting the table, the student ﬁnds that el Castillo was built 1,100 t o 1,400 y ears ago and is  ______",
        "question": "Which choice most eff ectiv ely uses data fr om the table t o complete the text?",
        "options": ["33 meters tall.","47 meters tall.","40 meters tall.","60 meters tall."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it most eff ectiv ely uses data fr om the table t o complete the text about the el Castillo pyramid. The table pr esents information for the location, height, and age of four p yramids, and the task is t o use the data fr om the table t o complete the text b y choosing the corr ect height for el Castillo, which the table shows is 40 meters. Choice A is incorr ect because, accor ding t o the table, el Castillo is 40 meters tall, not 33 meters, which is the height of the Gr eat Pyramid in Mexico. Choice B is incorr ect because, accor ding t o the table, el Castillo is 40 meters tall, not 47 meters, which is the height of the P yramid of Sahur e in E gypt. Choice D is incorr ect because, accor ding t o the table, el Castillo is 40 meters tall, not 60 meters, which is the height of the P yramid of Djoser in E gypt.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-60c6b64d",
        "type": "Reading",
        "passage": "Male túngar a frogs mak e complex calls t o attr act mates, but their calls also attr act fr og-biting midges, insects that f eed on the frogs’ blood. Resear chers Ximena Bernal and Priy anka de Silv a wonder ed if the calls alone ar e suﬃcient for midges t o locate the frogs or if midges use carbon dio xide emitted b y frogs as an additional cue t o their pr ey’s wher eabouts, lik e mosquit oes do. In an experiment, the r esear chers placed two midge tr aps in a túngar a frog br eeding ar ea. One tr ap pla yed recor dings of túngar a frog calls and the other r eleased carbon dio xide along with pla ying the calls. Bernal and de Silv a concluded that carbon dio xide does not ser ve as an additional cue t o frog-biting midges.",
        "question": "Which ﬁnding fr om the experiment, if true, would most dir ectly suppor t Bernal and de Silv a’s conclusion?",
        "options": ["Only a small number of midges wer e found in the tr aps, though the majority wer e found in the tr ap that pla yed calls and released carbon dio xide.","Midges enter ed the tr ap that r eleased carbon dio xide and pla yed calls only during or immediately after periods of carbon dioxide r elease.","More midges wer e found in the tr ap that only pla yed calls than in the tr ap that pla yed calls and r eleased carbon dio xide.","The tr ap that r eleased carbon dio xide and pla yed calls attr acted f ew midges when carbon dio xide concentr ations wer e low but attracted many midges when carbon dio xide concentr ations wer e high."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it pr esents a ﬁnding that, if true, would most dir ectly suppor t the r esear chers’ conclusion that carbon dio xide does not ser ve as an additional cue t o frog-biting midges r egar ding the location of male túngar a frogs. The text begins b y stating that the mating call of the male túngar a frogs also attr acts fr og-biting midges, which pr ey on the fr ogs’ blood. Resear chers Bernal and de Silv a wer e curious if the mating calls wer e suﬃcient signals for the midges t o locate the fr ogs or if midges also used carbon dio xide emitted b y the fr ogs t o locate their pr ey. The text then details the pr ocedur e the r esear chers used to inv estigate their question and summariz es their conclusion—that carbon dio xide does not ser ve as an additional cue t o the midges. Thus, if mor e midges wer e found in the r esear chers’ tr ap that only pla yed calls than in the tr ap that pla yed calls and released carbon dio xide, it follows that the fr og calls seem suﬃcient without the carbon dio xide cue. This ﬁnding suppor ts the resear chers’ conclusion that carbon dio xide does not ser ve as an additional cue t o frog-biting midges. Choice A is incorr ect because ﬁnding that the majority of fr og-biting midges wer e found in the tr aps that both pla yed the mating call and r eleased carbon dio xide would pr esent e vidence that dir ectly r efutes the r esear chers’ conclusion—that carbon dio xide does not ser ve as an additional cue t o the fr og-biting midges r egar ding the location of túngar a frogs. Choice B is incorr ect because if the midges enter ed the tr ap that pla yed calls and r eleased carbon dio xide only during or immediately after carbon dioxide was r eleased, that would suggest that the midges used the carbon dio xide as a wa y to locate their pr ey, a ﬁnding that would contr adict the r esear chers’ conclusion that carbon dio xide was not an additional cue t o the midges. Choice D is incorr ect because a tr ap attr acting lar ger numbers of midges with high carbon dio xide concentr ations than a tr ap with low carbon dio xide concentr ations suggests that carbon dio xide might ser ve as an additional cue t o the midges as t o the location on the fr ogs, a ﬁnding contr ary to the r esear chers’ conclusion.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-1f3be847",
        "type": "Reading",
        "passage": "“Loon P oint” is a 1912 poem b y Amy Lowell. In the poem, which pr esents a nighttime scene on a body of water , Lowell describes an element of natur e as an activ e par ticipant in the experience, writing, ______",
        "question": "Which quotation fr om “Loon P oint” most eff ectiv ely illustr ates the claim?",
        "options": ["“Through the water the moon writes her legends / In light, on the smooth, wet sand. ”","“Softly the water ripples / Against the canoe ’s cur ving side. ”","“Or lik e the snow-white petals / Which dr op fr om an o verblown r ose.”","“But the moon in her wa ywar d beauty / Is e ver and alwa ys the same. ”"],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most eff ectiv ely illustr ates the claim that Lowell describes an element of natur e as an activ e par ticipant in the experience of a nighttime scene on a body of water . The quotation pr esents the image of the moon shining on a body of water . Howe ver, instead of describing the moon in passiv e terms or simply stating that it r eﬂects thr ough the water and ont o the sandy shor e, the quotation por trays the moon as being engaged in the humanlik e action of writing a legend. In other wor ds, the moon is par ticipating activ ely in the nighttime scene. Choice B is incorr ect. Although the quotation describes a nighttime scene on a body of water , the element of natur e in these lines —the wa ves—isn ’t por trayed as an activ e par ticipant in an experience; instead, the wa ves mer ely ripple softly against a canoe, as waves would normally do. Choice C is incorr ect because the quotation doesn ’t present a nighttime scene on a body of water; instead, it describes petals falling fr om a r ose. Choice D is incorr ect. Although the quotation pr esents an image of an element of natur e—the moon—it doesn ’t mention a body of water; mor eover, it por trays the moon not as an activ e par ticipant in a scene but instead as static or unchanging (“ ever and alwa ys the same ”).",
        "difficulty": "Medium"
    },
    {
        "id": "em2-040583a5",
        "type": "Reading",
        "passage": "12 11 10 9 8 7 6 5 4 3 2 1 0Time (days) 14°C 16°C 18°C 20°CBanana Ripening Time at Different Temperatures with and without Ethylene Treatment Temperature (degrees Celsius) ethylene no ethylene A student is conducting an experiment t o test the eff ect of temper ature and ethylene tr eatment on the ripening speed of bananas. The student tr eated some bananas with ethylene while lea ving others untr eated, then allowed both types of bananas t o ripen at one of four diff erent temper atures. Comparing the data for bananas with and without ethylene, the student concluded that ______",
        "question": "Which choice most eff ectiv ely uses data fr om the gr aph t o complete the student’ s conclusion?",
        "options": ["20°C is the ideal temper ature at which t o store bananas t o slow ripening time.","for those bananas that wer e not tr eated with ethylene, diff erences in temper ature wer e not associated with absolute differences in ripening time.","bananas tr eated with ethylene ripen faster at 14°C and 16°C than at 18°C and 20°C.","ethylene was associated with a gr eater absolute change in ripening time at 14°C, 16°C, and 18°C than at 20°C."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it most eff ectiv ely uses data fr om the gr aph t o complete the student’ s conclusion about banana ripening time with and without ethylene at diff erent temper atures. The gr aph shows that at 20°C, the gap between the two bars showing ripening times for ethylene-tr eated bananas and untr eated bananas cr osses f ewer than 2 gridlines (fr om about 4 Command of EvidenceDiﬃculty 18°C, the gap between the bars cr osses mor e than 2 gridlines (fr om about 8 da ys for tr eated bananas t o about 11 da ys for untreated bananas at 14°C; fr om about 6 da ys for tr eated bananas t o about 9.5 da ys for untr eated bananas at 16°C; and fr om about 5.5 da ys for tr eated bananas t o about 8.5 da ys for untr eated bananas at 18°C ). Since the gap between the bars at each of these temper atures cr osses mor e than 2 gridlines, and since each of these gaps is lar ger than the gap between the bars at 20°C, it can be concluded that ethylene was associated with a gr eater absolute change in ripening time at 14°C, 16°C, and 18°C than at 20°C. Choice A is incorr ect because the gr aph shows that ethylene-tr eated bananas st ored at 20°C ripen mor e quickly than ethylene- treated bananas st ored at the other temper atures do (about 4 da ys at 20°C vs. about 5.5, 6, and 8 da ys at 18°C, 16°C, and 14°C, respectiv ely) and that untr eated bananas st ored at 20°C ripen mor e quickly than untr eated bananas st ored at the other temper atures do (about 5.5 da ys at 20°C vs. about 8.5, 9.5, and 11 da ys at 18°C, 16°C, and 14°C, r espectiv ely). The information in the gr aph ther efore indicates that st oring bananas at 20°C speeds up ripening time r elativ e to storing bananas at the other temper atures shown, not that this st orage temper ature slows ripening time. Choice B is incorr ect because the gr aph shows that as temper ature incr eases, the ripening time of untr eated bananas decr eases, fr om about 11 da ys at 14°C t o about 5.5 da ys at 20°C, with no ex ceptions t o this tr end. The gr aph ther efore shows that diff erences in temper ature wer e associated with absolute differences in ripening time, not that ther e was no association between diff erences in temper ature and diff erences in ripening time. Choice C is incorr ect because the gr aph shows that ripening times of ethylene-tr eated bananas at 14°C and 16°C wer e about 8 and 6 da ys, respectiv ely, which is gr eater than, not less than, ripening times of ethylene-tr eated bananas at 18°C and 20°C, which were about 5.5 and 4 da ys, respectiv ely. In other wor ds, bananas tr eated with ethylene ripen mor e slowly , not faster , at 14°C and 16°C than at 18°C and 20°C.",
        "difficulty": "Hard"
    },
    {
        "id": "em2-7a1877be",
        "type": "Reading",
        "passage": "Nucleobase Concentr ations fr om Mur chison Meteorite and Soil Samples in P arts per Billion Nucleobase Murchison meteorite sample 1 Murchison meteorite sample 2 Murchison soil sample Isoguanine 0.5 0.04 not detected Purine 0.2 0.02 not detected Xanthine 39 3 1 Adenine 15 1 40 Hypo xanthine 24 1 2 Emplo ying high-per formance liquid chr omat ography—a pr ocess that uses pr essuriz ed water t o separ ate material int o its component molecules—astr ochemist Y ashir o Oba and colleagues analyz ed two samples of the Mur chison meteorite that landed in Australia as well as soil fr om the landing z one of the meteorite t o determine the concentr ations of v arious or ganic molecules. By comparing the r elativ e concentr ations of types of molecules known as nucleobases in the Mur chison meteorite with those in the soil, the team concluded that ther e is e vidence that the nucleobases in the Mur chison meteorite formed in space and ar e not the r esult of contamination on Ear th.",
        "question": "Which choice best describes data fr om the table that suppor t the team ’s conclusion?",
        "options": ["Isoguanine and purine wer e detected in both meteorite samples but not in the soil sample.","Adenine and xanthine wer e detected in both of the meteorite samples and in the soil sample.","Hypo xanthine and purine wer e detected in both the Mur chison meteorite sample 2 and in the soil sample.","Isoguanine and hypo xanthine wer e detected in the Mur chison meteorite sample 1 but not in sample 2."],
        "answer": 0,
        "explanation": "Choice A is the best answer . The r esear chers concluded that the meteorite ’s nucleobases wer en’t the r esult of soil contamination. Presence of nucleobases in the meteorite and not in soil pr ovides e vidence that those nucleobases lik ely didn ’t come fr om the soil. Choice B is incorr ect. This choice doesn ’t justify the conclusion. The r esear chers concluded that the meteorite ’s nucleobases weren’t the r esult of soil contamination. If the nucleobases ar e present in both the soil and meteorite, then it’ s possible that these nucleobases came fr om the soil. Choice C is incorr ect. This choice misr eads the table. Purine was not detected in the soil sample. Choice D is incorr ect. This choice misr eads the table. Both isoguanine and hypo xanthine wer e detected in both Mur chison meteorite samples.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-11a9f635",
        "type": "Reading",
        "passage": "Paleont ologists sear ching for signs of ancient lif e ha ve found many fossiliz ed specimens of pr ehist oric human ancest ors, including se veral from the Pleist ocene er a disco vered in a geological formation in the Minat ogawa quarr y in Japan. Howe ver, to study the emer gence of the earliest multicellular or ganisms t o appear on Ear th, resear chers must turn elsewher e, such as t o the Ediacar an geological formation at Mistak en P oint in Canada. A UNESCO W orld Heritage Site, the 146-hectar e reser ve contains more than 10,000 fossils that t ogether document a critical moment in e volutionar y hist ory.",
        "question": "What does the text indicate about the geological formation at Mistak en P oint?",
        "options": ["It holds a gr eater number of fossils but fr om a smaller v ariety of species than the formation in the Minat ogawa quarr y does.","It has pr ovided e vidence that the earliest human species ma y have emer ged befor e the Pleist ocene er a.","It is widely consider ed b y paleont ologists t o be the most v aluable sour ce of information about pr ehist oric lif e forms.","It contains specimens fr om an older time period than those found in the formation in the Minat ogawa quarr y."],
        "answer": 3,
        "explanation": "Choice D is the best answer . The text sa ys that the formation at Mistak en P oint contains fossils of “the earliest multicellular organisms, ” which implies that these fossils ar e from an older time period than the fossils of “ prehist oric human ancest ors” found in the Minat ogawa quarr y. Choice A is incorr ect. The text sa ys that the formation at Mistak e Point contains “ more than 10,000 fossils, ” but it doesn ’t compar e this number t o the number of fossils in the Minat ogawa quarr y. It also doesn ’t say anything about the v ariety of species in either formation. Choice B is incorr ect. The text sa ys that the formation at Mistak en P oint contains fossils of “the earliest multicellular organisms, ” but it ne ver sa ys that the site contains early human fossils t oo. Rather , the early human fossils mentioned in the text were found in the formation at Minat ogawa quarr y. Choice C is incorr ect. The text sa ys that the fossils at Mistak en P oint “document a critical moment in e volutionar y hist ory,” but it ne ver sa ys that Mistak en P oint is the most v aluable sour ce of information about pr ehist oric lif e forms.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-2312021b",
        "type": "Reading",
        "passage": "In a study b y Mika R. Mor an, Daniel A. Rodriguez, and colleagues, r esidents of Quit o, Ecuador , and Lima, P eru, wer e sur veyed about parks in their cities. Of the 618 r espondents fr om Quit o, 82.9% indicated that the y use the city ’s parks, and of the 663 r espondents from Lima, 72.7% indicated using city parks. Giv en that the per centage of Quit o respondents who r epor ted living within a 10- minute walk of a park was much lower than that r epor ted b y Lima r espondents, gr eater pr oximity alone can ’t explain the diff erence in park use.",
        "question": "The text mak es which point about the diff erence between the pr opor tions of Quit o residents and Lima r esidents using parks?",
        "options": ["It was much lar ger than the r esear chers conducting the study expected.","It is caused b y something other than the parks’ pr oximity t o city r esidents.","It could be due t o inaccur acies in the sur vey results.","It was calculated using sour ces that pr edate the sur vey."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a statement about the diff erence between the pr opor tions of Quit o residents and Lima r esidents using parks that is suppor ted b y the text. The text states that 82.9% of sur veyed Quit o residents and 72.7% of surveyed Lima r esidents r epor ted using their city ’s parks. The text then notes that compar ed to Lima r espondents, a much smaller percentage of Quit o respondents said the y live within a 10-minute walk of a park. The text concludes that because a gr eater propor tion of Quit o respondents used parks despite gener ally living far ther fr om them than Lima r espondents did, \" greater proximity \"—being closer t o a park—\" can’t explain the diff erence in park use. \" That is, the text mak es the point that the diff erence between the pr opor tions of Quit o residents and Lima r esidents using parks is caused b y something other than the distance of the parks fr om city r esidents. Choice A is incorr ect because the text doesn ’t addr ess whether the r esear chers had expected a par ticular r esult and doesn ’t indicate that the y wer e surprised b y the diff erence in park usage between the two cities’ r esidents. The text simply pr esents the survey ﬁndings without stating the r esear chers’ expectations. Choice C is incorr ect because the text giv es no indication that ther e might be inaccur acies in the sur vey results; the text pr esents the ﬁndings as factual information and uses them as the basis for a conclusion that a cer tain fact or doesn ’t explain diff erences in park usage between Quit o and Lima r esidents. Choice D is incorr ect because the text doesn ’t mention any sour ces that pr edate the sur vey or suggest that the diff erence in pr opor tions was calculated using such sour ces. Accor ding t o the text, the information about park usage came dir ectly fr om the sur vey of r esidents in Quit o and Lima.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-57485f5e",
        "type": "Reading",
        "passage": "The following text is adapted fr om Johanna Sp yri’s 1881 no vel Heidi (translated b y Elisabeth St ork in 1915). Eight-y ear-old Heidi and her friend’ s grandmother ar e looking at some illustr ated books. Heidi had come and was looking with wondering e yes at the splendid pictur es in the lar ge books, that Gr andmama was showing her . Suddenly she scr eamed aloud, for ther e on the pictur e she saw a peaceful ﬂock gr azing on a gr een pastur e. In the middle a shepher d was standing, leaning on his cr ook. The setting sun was shedding a golden light o ver everything. With glowing e yes Heidi de voured the scene.",
        "question": "Which choice best states the main idea of the text?",
        "options": ["Heidi is upset until she sees a ser ene image of a pastur e in one of Gr andmama ’s books.","Heidi is delighted and fascinated b y an image she sees in one of Gr andmama ’s books.","Heidi is initially frightened b y an image in one of Gr andmama ’s books but quickly comes t o appr eciate its beauty .","Heidi is inspecting an image in one of Gr andmama ’s books because she has ne ver seen a shepher d with his sheep befor e."],
        "answer": 1,
        "explanation": "Choice B is the best answer because it most eff ectiv ely states the main idea of the text, which is that Heidi is delighted and fascinated b y an image she sees in one of Gr andmama ’s books. In the text, Heidi scr eams upon ﬁrst seeing the pictur e of the green pastur e. In another context, such a r eaction might suggest f ear, but her e the r eaction is followed b y descriptions of an image that’ s peaceful r ather than scar y. The text goes on t o describe Heidi’ s eyes as “ glowing” and states that she “ devoured the scene, ” suggesting that the image delights and fascinates her so much that she wants t o examine e very detail. Together , these descriptions suggest that Heidi is thrilled and intrigued b y the image in the book. Choice A is incorr ect because ther e’s nothing in the text t o suggest that Heidi is upset befor e seeing the peaceful image of the green pastur e. Befor e Heidi sees that image, the text describes her as “looking with wondering e yes at the splendid pictur es” in the book, suggesting that Heidi is intrigued, not that she ’s unhapp y. Choice C is incorr ect. Although Heidi scr eams upon ﬁrst seeing the image, the text’ s description of the image and Heidi’ s other r eactions t o it suggest that she is scr eaming with delight, not f ear. The text describes the images in the book as “ splendid” and the par ticular image that causes her t o scr eam as peaceful r ather than frightening. It also describes Heidi’ s eyes as “ glowing” and states that she “ devoured the scene, ” suggesting that the image of the gr een pastur e delights and fascinates her so much that she wants t o examine e very detail. Choice D is incorr ect because it’ s unclear fr om the text whether Heidi has e ver seen a shepher d with his sheep befor e. The text mer ely suggests that she is delighted and fascinated b y the image of the shepher d and his sheep.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-a68f d3e7",
        "type": "Reading",
        "passage": "Many of William Shak espear e’s tragedies addr ess br oad themes that still appeal t o today’s audiences. F or instance, Romeo and Juliet , which is set in the Italy of Shak espear e’s time, tackles the themes of par ents v ersus childr en and lo ve versus hate, and the play continues t o be r ead and pr oduced widely ar ound the world. But understanding Shak espear e’s so-called hist ory pla ys can requir e a knowledge of se veral centuries of English hist ory. Consequently , ______",
        "question": "Which choice most logically completes the text?",
        "options": ["many theater goers and r eaders t oday are likely to ﬁnd Shak espear e’s hist ory pla ys less engaging than the tr agedies.","some of Shak espear e’s tragedies ar e mor e relevant t o today’s audiences than twentieth-centur y pla ys.","Romeo and Juliet is the most thematically accessible of all Shak espear e’s tragedies.","exper ts in English hist ory tend t o prefer Shak espear e’s hist ory pla ys to his other works."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most logically completes the text’ s discussion of the r elativ e appeal of diff erent kinds of plays by Shak espear e to today’s audiences. Accor ding t o the text, Shak espear e’s tragedies addr ess br oad themes that continue t o appeal t o today’s audiences. Indeed, the text suggests that these themes ar e timeless, as illustr ated b y the example of Romeo and Juliet , which the text states is still r ead and widely per formed despite being set in the Italy of Shak espear e’s time. In contr ast, the text indicates that audiences and r eaders ma y need t o be familiar with se veral centuries of English hist ory in or der t o understand Shak espear e’s hist ory pla ys. Because many theater goers and r eaders ar e unlik ely to possess such extensiv e hist orical knowledge, it follows that the y are likely to ﬁnd Shak espear e’s hist ory pla ys less engaging than his mor e accessible tr agedies. Choice B is incorr ect because the text ne ver intr oduces a comparison between Shak espear e’s tragedies and twentieth-centur y plays, only between Shak espear e’s tragedies and his hist ory pla ys. Since twentieth-centur y pla ys ar en’t mentioned, ther e’s no basis in the text for the idea that some of Shak espear e’s tragedies ar e mor e relevant than twentieth-centur y pla ys to today’s audiences. Choice C is incorr ect. Although the text indicates that Romeo and Juliet is thematically accessible t o today’s audiences, it doesn ’t suggest that Romeo and Juliet is mor e accessible than Shak espear e’s other tr agedies. Rather , the text pr esents Romeo and Juliet as an example t o suppor t the idea that Shak espear e’s tragedies hold continued appeal for t oday’s readers and theater goers. Choice D is incorr ect. Although exper ts in English hist ory would lik ely possess the knowledge needed t o understand Shak espear e’s hist ory pla ys, the text ne ver mentions such exper ts or suggests that the y would enjo y the hist ory pla ys mor e than Shak espear e’s other works.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-e677fa6c",
        "type": "Reading",
        "passage": "The following text is adapted fr om E dgar Allan P oe’s 1849 st ory “Landor ’s Cottage. ” During a pedestrian trip last summer , through one or two of the riv er counties of New Y ork, I found myself, as the da y declined, somewhat embarr assed about the r oad I was pursuing. The land undulated v ery remarkably; and my path, for the last hour , had wound about and about so confusedly , in its effor t to keep in the v alleys, that I no longer knew in what dir ection lay the sweet village of B——, wher e I had determined t o stop for the night.",
        "question": "Which choice best states the main idea of the text?",
        "options": ["The narr ator remembers a trip he t ook and admits t o getting lost.","The narr ator recalls fond memories of a journe y that he t ook thr ough some beautiful riv er counties.","The narr ator describes what he saw during a long trip thr ough a fr equently visited location.","The narr ator explains the diﬃculties he encounter ed on a trip and how he o vercame them."],
        "answer": 0,
        "explanation": "Choice A is the best answer . The narr ator is “ embarr assed” about the r oute he t ook, which ends up lea ving him lost and confused about how t o get t o his destination for the e vening. Choice B is incorr ect. This choice doesn ’t match the passage. The narr ator is embarr assed, r ather than fond, and he doesn ’t describe the beauty of the place. Choice C is incorr ect. This choice doesn ’t match the passage. W e don ’t know fr om this ex cerpt whether or not the narr ator has visited this par t of New Y ork multiple times. Choice D is incorr ect. This choice doesn ’t match the passage. The narr ator doesn ’t explain how he o vercame being lost in this ex cerpt.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-bc7b1a04",
        "type": "Reading",
        "passage": "Three Studies' Estimated A verage V elocity of LMC Resear chers Study y ear Estimated a verage v elocity Murai and F ujimot o 1980 344 km/s Kalliv ayalil and colleagues 2006 378 km/s Gardiner and colleagues 1994 297 km/s In 2006, Nity a Kalliv ayalil and colleagues calculated the most accur ate estimate y et of the a verage v elocity (in kilometers per second) of the Lar ge Magellanic Cloud (LMC ) galaxy . Befor e the 2006 study , estimates of the a verage v elocity wer e low enough for the LMC t o maintain an orbit ar ound the Milky W ay galaxy , but accor ding t o an analysis b y Gur tina Besla and colleagues, the estimated v elocity fr om the 2006 study is t oo high for the LMC t o maintain such an orbit. Ther efore, if Besla and colleagues ar e correct, the maximum a verage v elocity for the LMC that would allow it t o maintain orbit ar ound the Milky W ay is lik ely ______",
        "question": "Which choice most eff ectiv ely uses data fr om the table t o complete the statement?",
        "options": ["above 344 km/s but below 378 km/s.","above 297 km/s but below 344 km/s.","above 378 km/s.","below 297 km/s."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it uses data fr om the table t o giv e the r ange of v elocities for the LMC fr om the 1980 v alue (344 km/s) t o the 2006 v alue (378 km/s), ther eby eff ectiv ely completing the text. The text indicates that befor e 2006, all the estimated v elocities of the LMC wer e within the r ange necessar y to maintain orbit ar ound the Milky W ay galaxy . It then indicates that, accor ding t o Besla and colleagues, the 2006 estimate of 378 km/s is t oo high t o maintain that orbit. This str ongly implies that if the 1980 v alue (344 km/s) is below the orbital thr eshold, and if Besla and colleagues ar e corr ect that the 2006 v alue (378 km/s) is abo ve that thr eshold, the maximum orbital v elocity for the LMC must be somewher e in the r ange fr om abo ve 344 km/s t o below 378 km/s. Choice B is incorr ect. The text indicates that the 2006 v elocity estimate for the LMC (378 km/s) was the ﬁrst estimate that exceeded the v elocity needed t o maintain orbit ar ound the Milky W ay. Thus, the 1980 estimate of 344 km/s and the 1994 estimate of 297 km/s must both be below the maximum possible orbital v elocity for the LMC. Choice C is incorr ect. The text states that Besla and colleagues’ analysis found that the v elocity fr om the 2006 study (378 km/s) was t oo high for the LMC t o maintain orbit around the Milky W ay. Ther efore, if a v elocity of 378 km/s is t oo high, an e ven higher v elocity will also be t oo high. Choice D is incorr ect. The text indicates that the 2006 v elocity estimate for the LMC (378 km/s) was the ﬁrst t o exceed the v elocity r ange requir ed to maintain orbit ar ound the Milky W ay. Thus, the 1994 estimate of 297 km/s must be below the maximum possible orbital v elocity for the LMC.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-3d91c973",
        "type": "Reading",
        "passage": "Mosasaurs wer e lar ge marine r eptiles that liv ed in the Late Cr etaceous period, appr oximately 100 million t o 66 million y ears ago. Celina Suar ez, Alber to Pérez-Huer ta, and T. Lynn Harr ell Jr . examined o xygen-18 isot opes in mosasaur t ooth enamel in or der t o calculate lik ely mosasaur body temper atures and determined that mosasaurs wer e endothermic—that is, the y used internal metabolic pr ocesses t o maintain a stable body temper ature in a v ariety of ambient temper atures. Suar ez, P érez-Huer ta, and Harr ell claim that endothermy would ha ve enabled mosasaurs t o include r elativ ely cold polar waters in their r ange.",
        "question": "Which ﬁnding, if true, would most dir ectly suppor t Suar ez, P érez-Huer ta, and Harr ell’s claim?",
        "options": ["Mosasaurs’ lik ely body temper atures ar e easier t o determine fr om t ooth enamel o xygen-18 isot ope data than the body temper atures of nonendothermic Late Cr etaceous marine r eptiles ar e.","Fossils of both mosasaurs and nonendothermic marine r eptiles ha ve been found in r oughly equal numbers in r egions known t o be near the poles during the Late Cr etaceous, though in lower concentr ations than elsewher e.","Several mosasaur fossils ha ve been found in r egions known t o be near the poles during the Late Cr etaceous, while r elativ ely few fossils of nonendothermic marine r eptiles ha ve been found in those locations.","During the Late Cr etaceous, seawater temper atures wer e likely higher thr oughout mosasaurs’ r ange, including near the poles, than seawater temper atures at those same latitudes ar e today."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it pr esents the ﬁnding that, if true, would best suppor t Suar ez, P érez-Huer ta, and Harr ell’s claim about mosasaurs. The text states that Suar ez, P érez-Huer ta, and Harr ell’s resear ch on mosasaur t ooth enamel led them t o conclude that mosasaurs wer e endothermic, which means that the y could liv e in waters at many diff erent temper atures and still maintain a stable body temper ature. The r esear chers claim that endothermy enabled mosasaurs t o live in r elativ ely cold waters near the poles. If se veral mosasaur fossils ha ve been found in ar eas that wer e near the poles during the period when mosasaurs were aliv e and fossils of nonendothermic marine r eptiles ar e rare in such locations, that would suppor t the r esear chers’ claim: it would show that mosasaurs inhabited polar waters but nonendothermic marine mammals tended not t o, suggesting that endothermy ma y have been the char acteristic that enabled mosasaurs t o include polar waters in their r ange. Choice A is incorr ect because ﬁnding that it’ s easier t o determine mosasaur body temper atures fr om t ooth enamel data than it is to determine nonendothermic r eptile body temper atures wouldn ’t suppor t the r esear chers’ claim. Whether one r esear ch pr ocess is more diﬃcult than another indicates nothing about the r esults of those pr ocesses and ther efore is irr elevant t o the issue of wher e mosasaurs liv ed and what enabled them t o live in those locations.   Choice B is incorr ect because ﬁnding r oughly equal numbers of mosasaur and nonendothermic marine r eptile fossils in ar eas that wer e near the poles in the Late Cr etaceous would suggest that endothermy didn ’t giv e mosasaurs any par ticular adv antage when it came t o expanding their r ange t o include r elativ ely cold polar waters, ther eby weak ening the r esear chers’ claim r ather than suppor ting it. Choice D is incorr ect because ﬁnding that the temper ature of seawater in the Late Cr etaceous was warmer than seawater t oday wouldn ’t weak en the r esear chers’ claim. Seawater in the Late Cr etaceous could ha ve been warmer than seawater t oday but still cold enough for endothermy t o be advantageous t o mosasaurs, so this ﬁnding wouldn ’t provide enough information t o either suppor t or weak en the r esear chers’ claim.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-11c68ded",
        "type": "Reading",
        "passage": "A contr action of “y ou all, ” the pr onoun “y ’all” has long been used as a plur al version of “y ou” in the South and in Black communities around the US. In r ecent decades, most other English-speaking communities in the US ha ve begun t o use “y ’all.” What explains its",
        "question": "rise in popularity? Many v arieties of English ha ve no pr onoun that speciﬁcally addr esses mor e than one person and instead must use “y ou” t o addr ess both one person and mor e than one. But “y ’all” alwa ys refers t o two or mor e people. As a r esult, it conv eys the speak er’s meaning mor e precisely than “y ou” can. Which question does the text most dir ectly attempt t o answer?",
        "options": ["How many other plur al versions of the pr onoun “y ou” ar e ther e in English, besides “y ’all”?","Why has the pr onoun “y ’all” become mor e widely used in the US?","When was the ﬁrst r ecor ded use of the pr onoun “y ’all” in the English language?","Is “y ’all” commonly used in English-speaking r egions of the world besides the US?"],
        "answer": 1,
        "explanation": "Choice B is the best answer because it pr esents a question that the text is attempting t o answer: why has the pr onoun \"y ’all\" become mor e widely used in the US? The text begins b y explaining wher e and how the plur al pr onoun \"y ’all\" originated and then goes on t o state that its use has been rising in popularity , even in ar eas outside of its place of origin. The text then attributes this rise in popularity t o the fact that many v arieties of English do not ha ve a pr onoun t o addr ess mor e than one person, and thus \"y ou\" must function as both a singular and plur al pr onoun. Choice A is incorr ect because while the text states that \"y ’all\" is used as a plur al of \"y ou\" in English, it does not discuss other plur al forms of the wor d. Choice C is incorr ect because while the text discusses the gener al origins of the pr onoun \"y ’all,\" it does not state when the use of the pr onoun was ﬁrst r ecor ded in the English language. Choice D is incorr ect because though the text addr esses the use of the pr onoun \"y ’all\" within English-speaking communities in the US, it does not addr ess its use outside of that geogr aphic ar ea.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-7cbb9764",
        "type": "Reading",
        "passage": "Accomplished printmak er and sculpt or Elizabeth Catlett (1915–2012) used her ar t to explor e the Black experience in the United States. In a paper for an ar t hist ory class, a student claims that Catlett had a par ticular talent for unifying v arious ar tistic tr aditions and styles in her work.",
        "question": "Which quotation fr om a scholar describing Catlett’ s work would best suppor t the student’ s claim?",
        "options": ["“In Mother and Child , a sculptur e of two Black ﬁgur es, Catlett used an ancient Indigenous sculpting technique and combined the visual aesthetic of modern Mexican mur alists with that of German ar tist Kathe K ollwitz. ”","“In her collage New Gener ation , Catlett o verlaid fabric ont o the canv as to represent the clothing of a father and his t oddler , positioned t o evoke classic images of a mother and child. ”","“Created in 1968, Catlett’ s sculptur e Black Unity , a styliz ed ﬁst sculpted fr om mahogany and measuring two f eet acr oss, remains an impor tant piece and has r eceiv ed renewed and well-deser ved attention in r ecent y ears. ”","“One series of Catlett’ s prints, made b y the ar tist using the linoleum cut method, depicts se veral notable African American women, including Harriet Tubman and Sojourner Truth. ”"],
        "answer": 0,
        "explanation": "Choice A is the best answer because it pr esents a quotation about Elizabeth Catlett that suppor ts the student’ s claim that this artist had a talent for unifying v arious tr aditions and styles in her work. The quotation explains that t o create the work, Catlett combined Indigenous sculptur e with the visual aesthetic of modern mur alists fr om Mexico as well as that of German ar tist Kathe Kollwitz. In other wor ds, Catlett was able t o unify se veral ar tistic tr aditions and styles within a single sculptur e. Choice B is incorr ect because in discussing the technique and subject matter of Catlett’ s collage, the quotation mak es no reference t o par ticular tr aditions or styles. Choice C is incorr ect because in describing the sculptur e, the quotation doesn ’t mention any ar tistic tr aditions or styles that Catlett ma y have synthesiz ed to create the work. Choice D is incorr ect because in discussing Catlett’ s prints of notable African American women, the quotation doesn ’t char acteriz e those prints as ha ving fused diff erent traditions or styles.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-4b3d6062",
        "type": "Reading",
        "passage": "The Mammillaria cactus M. boolii occurs natur ally only in the state of Sonor a in Mexico, and the smallness of its r ange mak es it especially vulner able t o extinction. The tr aditional single-species appr oach t o conser vation emphasiz es the need t o focus on individual species most at risk, lik e M. boolii , but r ecently , conser vationists ha ve argued that an ecosystem-based appr oach that incorpor ates the many inter actions between the climate, terr ain, and v arious species of a giv en geogr aphical ar ea ma y lead t o better outcomes for all the species in a giv en location. If this view is corr ect, the single-species appr oach t o the conser vation of M. boolii could thus ______",
        "question": "Which choice most logically completes the text?",
        "options": ["lead t o a better understanding of how the distribution of Mammillaria species thr oughout Mexico has aff ected their sur vival.","allow conser vationists t o better consider how climatic changes aff ecting Sonor a ma y reduce the number of species competing with M. boolii .","erroneously shift the focus of conser vation effor ts awa y from M. boolii itself.","fail t o consider the wa ys in which the sur vival of M. boolii may be inﬂuenced b y changes in the populations of other species that inhabit Sonor a."],
        "answer": 3,
        "explanation": "Choice D is the best answer because it most logically completes the text’ s discussion of conser vation appr oaches for the Mammillaria cactus M. boolii . The text establishes that M. boolii only gr ows natur ally in the state of Sonor a in Mexico, which mak es it par ticularly vulner able t o extinction. The text then contr asts two appr oaches t o conser vation: the tr aditional single- species appr oach that individually focuses on at-risk species and a newer ecosystem-based appr oach that considers the inter actions between climate, terr ain, and v arious species in a geogr aphical ar ea. Accor ding t o the text, conser vationists ha ve recently ar gued that this ecosystem-based appr oach ma y lead t o better outcomes for all species in a location. If this ecosystem view is corr ect, then the single-species appr oach t o conser ving M. boolii would lik ely fail t o consider how the cactus’ s sur vival depends on its inter actions with other species in Sonor a’s ecosystem. Choice A is incorr ect because the text doesn ’t addr ess the distribution of Mammillaria species besides M. boolii throughout Mexico or discuss how that distribution aff ects sur vival. The text focuses speciﬁcally on M. boolii in Sonor a and diff erent appr oaches t o its conser vation. Choice B is incorr ect because the text doesn ’t suggest that climatic changes in Sonor a would reduce competition for M. boolii or that conser vation effor ts ar e focused on understanding this speciﬁc dynamic. In fact, the text implies that an ecosystem-based appr oach would consider climate among many other fact ors but doesn ’t specify how climatic changes might aff ect competition between species. Choice C is incorr ect because the text doesn ’t suggest that the single-species appr oach would shift the focus of conser vation effor ts awa y from M. boolii itself—r ather , it suggests that this appr oach might be too narr owly focused on M. boolii alone without considering the br oader ecosystem-r elated fact ors that aff ect its sur vival.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-94ca8ebd",
        "type": "Reading",
        "passage": "A student is examining a long, challenging poem that was initially published in a quar terly journal without explanat ory notes, then later r epublished in a stand-alone v olume containing only that poem and accompanying explanat ory notes written b y the poet. The student asser ts that the explanat ory notes wer e included in the r epublication primarily as a mark eting de vice t o help sell the stand- alone v olume.",
        "question": "Which statement, if true, would most dir ectly suppor t the student’ s claim?",
        "options": ["The text of the poem as published in the quar terly journal is not identical t o the text of the poem published in the stand-alone volume.","Many critics belie ve that the poet’ s explanat ory notes r emo ve cer tain ambiguities of the poem and mak e it less inter esting as a result.","The publishers of the stand-alone v olume r equested the explanat ory notes fr om the poet in or der t o mak e the book attr activ e to readers who alr eady had a cop y of the poem in a journal issue.","Corr espondence between the poet and the publisher r eveals that the poet’ s explanat ory notes went thr ough se veral dr afts."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it would most dir ectly suppor t the student’ s claim about the motiv ation for including explanat ory notes with the stand-alone v olume of the poem. The text explains that the poem had pr eviously been published without the notes in a quar terly journal. It stands t o reason that r eaders who had pur chased the journal issue containing the poem would be unlik ely to pur chase an unchanged v ersion of the poem in a stand-alone v olume. Howe ver, the inclusion of notes in that volume would encour age the pur chase of a stand-alone v olume, since the later text would diff er from the original b y including the author ’s own explanation of the poem. Ther efore, if it wer e true that the publishers of the stand-alone v olume had r equested the notes t o mak e the book attr activ e to readers who alr eady had a cop y of the journal issue, this fact would suppor t the student’ s claim that the notes wer e included primarily as a mark eting de vice. Choice A is incorr ect because the student’ s claim is about the motiv ation for including the explanat ory notes in the stand-alone volume, not about changes that might ha ve been made t o the poem itself for publication in that v olume; mor eover, the text ne ver suggests that such changes wer e made. Choice B is incorr ect because the student’ s claim is about why the explanat ory notes were included in the stand-alone v olume, not about how the notes aff ected r eaders’ and critics’ subsequent experience of the poem. Choice D is incorr ect because the fact that the poet dr afted multiple v ersions of the explanat ory notes doesn ’t dir ectly addr ess the issue of whether the notes wer e intended as a mark eting de vice, as the student claims; the corr espondence would suppor t this claim only if it showed that the poet had r evised the notes speciﬁcally t o mak e them useful t o the mark eting of the stand-alone v olume.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-66c47028",
        "type": "Reading",
        "passage": "In 1934 physicist E ugene Wigner posited the existence of a cr ystal consisting entir ely of electr ons in a hone ycomb-lik e structur e. The so-called Wigner cr ystal r emained lar gely conjectur e, howe ver, until F eng W ang and colleagues announced in 2021 that the y had captur ed an image of one. The r esear chers tr apped electr ons between two semiconduct ors and then cooled the appar atus, causing the electr ons t o settle int o a cr ystalline structur e. By inser ting an ultr athin sheet of gr aphene abo ve the cr ystal, the resear chers obtained an impr ession—the ﬁrst visual conﬁrmation of the Wigner cr ystal.",
        "question": "Which choice best states the main idea of the text?",
        "options": ["Resear chers ha ve obtained the most deﬁnitiv e evidence t o date of the existence of the Wigner cr ystal.","Resear chers ha ve identiﬁed an inno vative new method for working with unusual cr ystalline structur es.","Graphene is the most impor tant of the components r equir ed to captur e an image of a Wigner cr ystal.","It’s diﬃcult t o acquir e an image of a Wigner cr ystal because of the cr ystal’ s hone ycomb structur e."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most accur ately states the main idea of the text. Accor ding t o the text, E ugene Wigner hypothesiz ed that a cr ystal could exist that would be composed of electr ons and ha ve a hone ycomb-lik e shape. The text goes on to sa y that the existence of the Wigner cr ystal r emained unconﬁrmed until F eng W ang and colleagues wer e able t o mak e an impr ession of one using two semiconduct ors and an ultr athin sheet of gr aphene. Thus, the main idea is that r esear chers ha ve obtained the most deﬁnitiv e evidence t o date of the existence of the Wigner cr ystal. Choice B is incorr ect because the text focuses on one kind of cr ystal—the Wigner cr ystal— and doesn ’t discuss cr ystalline structur es in gener al. And although the text conv eys that W ang and colleagues ﬁgur ed out a wa y to captur e an image of a Wigner crystal, it doesn ’t addr ess the idea of applying this appr oach t o other types of cr ystals. Choice C is incorr ect because the text describes in gener al the pr ocess W ang and colleagues followed t o obtain an impr ession of the Wigner cr ystal; it doesn ’t addr ess the r elativ e impor tance of each component in that pr ocess. Choice D is incorr ect because the text doesn ’t state that r esear chers had a har d time getting an impr ession of the Wigner cr ystal because of its hone ycomb structur e. Nothing in the text indicates why it took so long t o prove the existence of this cr ystal or tak e an impr ession of it.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-0770b53d",
        "type": "Reading",
        "passage": "O Pioneers! is a 1913 no vel by Willa Cather . In the no vel, Cather por trays Alexandr a Ber gson as ha ving a deep emotional connection t o her natur al surr oundings: ______",
        "question": "Which quotation fr om O Pioneers! most eff ectiv ely illustr ates the claim?",
        "options": ["“She had ne ver known befor e how much the countr y meant t o her . The chirping of the insects down in the long gr ass had been like the sweetest music. She had f elt as if her hear t wer e hiding down ther e, somewher e, with the quail and the plo ver and all the little wild things that cr ooned or buzz ed in the sun. Under the long shaggy ridges, she f elt the futur e stirring. ”","“Alexandr a talk ed to the men about their cr ops and t o the women about their poultr y. She spent a whole da y with one y oung farmer who had been awa y at school, and who was experimenting with a new kind of clo ver ha y. She learned a gr eat deal. ”","“Alexandr a drove off alone. The r attle of her wagon was lost in the howling of the wind, but her lantern, held ﬁrmly between her feet, made a mo ving point of light along the highwa y, going deeper and deeper int o the dark countr y.”","“It was Alexandr a who r ead the papers and followed the mark ets, and who learned b y the mistak es of their neighbors. It was Alexandr a who could alwa ys tell about what it had cost t o fatten each steer , and who could guess the weight of a hog befor e it went on the scales closer than John Ber gson [her father] himself. ”"],
        "answer": 0,
        "explanation": "Choice A is the best answer because it pr esents the quotation that most dir ectly illustr ates the claim that Cather por trays Alexandr a as ha ving a deep emotional connection t o her natur al surr oundings. This quotation states that the countr y meant a great deal t o Alexandr a and then goes on t o detail se veral wa ys in which her natur al surr oundings aff ect her emotionally: the insects sound lik e “the sweetest music, ” she f eels as though “her hear t wer e hiding” in the gr ass “ with the quail and the plo ver,” and near the ridges she f eels “the futur e stirring. ” Choice B is incorr ect because the quotation doesn ’t suggest that Alexandr a had a deep emotional connection t o her natur al surroundings but instead describes how she inter acts with the people ar ound her t o learn mor e about cr ops, poultr y, and experiments with clo ver ha y. Choice C is incorr ect because the quotation doesn ’t suggest that Alexandr a has a deep emotional connection t o her natur al surr oundings but instead describes her nighttime depar ture in a wagon. The quotation sa ys nothing about Alexandr a’s emotional state. Choice D is incorr ect because the quotation doesn ’t conv ey Alexandr a’s deep emotional connection t o her natur al surr oundings; instead, this quotation describes how well she understands the mark ets and liv estock.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-58e9e497",
        "type": "Reading",
        "passage": "In the early nineteenth centur y, some E uro-American farmers in the nor theastern United States used agricultur al techniques developed b y the Haudenosaunee (Ir oquois) people centuries earlier , but it seems that f ew of those farmers had actually seen Haudenosaunee farms ﬁrsthand. Barring the possibility of se veral farmers of the same er a independently de veloping techniques that the Haudenosaunee people had alr eady inv ented, these facts most str ongly suggest that ______",
        "question": "Which choice most logically completes the text?",
        "options": ["those farmers learned the techniques fr om other people who wer e mor e dir ectly inﬂuenced b y Haudenosaunee pr actices.","the cr ops typically cultiv ated b y Euro-American farmers in the nor theastern United States wer e not well suited t o Haudenosaunee farming techniques.","Haudenosaunee farming techniques wer e widely used in r egions outside the nor theastern United States.","Euro-American farmers only began t o recogniz e the beneﬁts of Haudenosaunee farming techniques late in the nineteenth centur y."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most logically completes the text’ s discussion of E uro-American farmers’ use of Haudenosaunee agricultur al techniques. Accor ding t o the text, some E uro-American farmers wer e using these techniques in the early nineteenth centur y despite f ew of the farmers ha ving seen Haudenosaunee farms. One explanation for these facts might be that the farmers de veloped techniques on their own that alr eady had been inv ented centuries earlier b y the Haudenosaunee people, but the text explicitly bars, or rules out, this explanation. If E uro-American farmers didn ’t learn these techniques fr om dir ect obser vation of Haudenosaunee pr actices and didn ’t inv ent the techniques independently , then the most logical explanation is that they learned the techniques fr om other people who wer e mor e dir ectly inﬂuenced b y Haudenosaunee pr actices than the farmers themselv es wer e. Once the y learned about Haudenosaunee agricultur al pr actices, E uro-American farmers could then apply those practices t o their own farming. Choice B is incorr ect because the fact that some E uro-American farmers in the nor theastern United States wer e using Haudenosaunee techniques suggests that the techniques wer e likely useful for the cr ops the farmers r aised, not that the cr ops typically cultiv ated b y the farmers wer e not well suited t o Haudenosaunee farming techniques. If the farmers’ cr ops wer e ill suited to the techniques, it’ s unlik ely that the farmers would ha ve used those techniques. Choice C is incorr ect because the text indicates only that Haudenosaunee agricultur al techniques wer e used b y Euro-American farmers in the nor theastern United States, not that these techniques wer e widely used outside this r egion. Choice D is incorr ect because the text states that some E uro-American farmers wer e using Haudenosaunee farming techniques early in the nineteenth centur y. This suggests that some E uro-American farmers wer e beginning t o recogniz e the beneﬁts of these techniques near the star t of the centur y, not that such farmers only began t o recogniz e the beneﬁts of the techniques much later .",
        "difficulty": "Medium"
    },
    {
        "id": "em2-1a2b29c9",
        "type": "Reading",
        "passage": "The following text is adapted fr om María Cristina Mena ’s 1914 shor t story “The Vine-Leaf. ” It is a sa ying in the capital of Mexico that Dr . Malsufrido carries mor e family secr ets under his hat than any ar chbishop. The doct or’s hat is, appr opriately enough, uncommonly capacious, rising v ery high, and sinking so low that it seems t o be suppor ted b y his ears and e yebrows, and it has a furr y look, as if it had been brushed the wr ong wa y, which is perhaps what happens t o it if it is e ver brushed at all. When the doct or tak es it off, the family secr ets do not ﬂy out lik e a ﬂock of parr ots, but r emain nicely bottled up beneath a dome of old and highly polished iv ory.",
        "question": "Based on the text, how do people in the capital of Mexico most lik ely regar d Dr. Malsufrido?",
        "options": ["Many ha ve come t o tolerate him despite his dishe veled appear ance.","Few f eel concerned that he will divulge their conﬁdences.","Some dislik e how fr eely he discusses his own family .","Most would be unimpr essed b y him wer e it not for his pr ofessional exper tise."],
        "answer": 1,
        "explanation": "Choice B is the best answer . The text describes a sa ying in the capital that Malsufrido k eeps mor e secr ets than an ar chbishop. It also sa ys that when he tak es off his hat, “the family secr ets do not ﬂy out… but r emain nicely bottled up, ” suggesting that he will not betr ay his conﬁdences. Choice A is incorr ect. This choice doesn ’t reﬂect the text. While his hat is lar ge and appears t o ha ve been brushed in the wr ong direction, Dr . Malsufrido does not seem t o be r egar ded as ill-dr essed or dishe veled. Choice C is incorr ect. This choice is the opposite of what the text sa ys. The secr ets of families (his and others’) r emain “bottled up ” in his head. Choice D is incorr ect. This choice isn ’t suppor ted b y the text. His pr ofessional exper tise is not discussed in the passage.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-71904085",
        "type": "Reading",
        "passage": "Linguist Debor ah Tannen has cautioned against fr aming contentious issues in terms of two highly competitiv e perspectiv es, such as pr o versus con. Accor ding t o Tannen, this debate-driv en appr oach can strip issues of their complexity and, when used in fr ont of an audience, can be less informativ e than the pr esentation of multiple perspectiv es in a noncompetitiv e format. To test Tannen ’s hypothesis, students conducted a study in which the y showed par ticipants one of thr ee diff erent v ersions of local news commentar y about the same issue. Each v ersion f eatur ed a debate between two commentat ors with opposing views, a panel of three commentat ors with v arious views, or a single commentat or.",
        "question": "Which ﬁnding fr om the students’ study , if true, would most str ongly suppor t Tannen ’s hypothesis?",
        "options": ["On a verage, par ticipants per ceived commentat ors in the debate as mor e knowledgeable about the issue than commentat ors in the panel.","On a verage, par ticipants per ceived commentat ors in the panel as mor e knowledgeable about the issue than the single commentat or.","On a verage, par ticipants who watched the panel corr ectly answer ed mor e questions about the issue than those who watched the debate or the single commentat or did.","On a verage, par ticipants who watched the single commentat or corr ectly answer ed mor e questions about the issue than those who watched the debate did."],
        "answer": 2,
        "explanation": "Choice C is the best answer because it pr esents the ﬁnding that, if true, would most str ongly suppor t Tannen ’s hypothesis. Accor ding t o the text, Tannen ’s hypothesis is that multiple perspectiv es pr esented in a noncompetitiv e format is mor e informativ e than a debate between opposing viewpoints is. If par ticipants who saw a panel of thr ee commentat ors with v arious views about an issue answer ed mor e questions about the issue corr ectly than did par ticipants who saw a debate, that would suppor t Tannen ’s hypothesis since it would show that par ticipants who hear d multiple v aried perspectiv es wer e better informed than wer e participants who hear d a debate between opposing viewpoints. Choice A is incorr ect because ﬁnding that par ticipants per ceived commentat ors in the debate as mor e knowledgeable than commentat ors in the panel is irr elevant t o Tannen ’s hypothesis, which is that pr esenting multiple perspectiv es on an issue is mor e informativ e to the audience than pr esenting opposing views of the issue is. P articipants’ per ception of how knowledgeable panelists ar e has no bearing on how much par ticipants learn fr om the panelists. Choice B is incorr ect because ﬁnding that participants per ceived commentat ors in the panel as mor e knowledgeable than a single commentat or is irr elevant t o Tannen ’s hypothesis, which is that pr esenting multiple perspectiv es on an issue is mor e informativ e to the audience than pr esenting opposing views of the issue is. P articipants’ per ception of how knowledgeable panelists ar e has no bearing on how much participants learn fr om the panelists, and Tannen ’s hypothesis sa ys nothing about how informativ e single commentat ors ar e. Choice D is incorr ect because ﬁnding that par ticipants who watched a single commentat or answer ed mor e questions corr ectly than par ticipants who watched the debate did wouldn ’t be r elevant t o Tannen ’s hypothesis, which is that hearing multiple v arying perspectiv es is mor e informativ e than hearing a debate. Tannen ’s hypothesis sa ys nothing about how informativ e single commentat ors ar e.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-3190835d",
        "type": "Reading",
        "passage": "Some businesses belie ve that when emplo yees ar e interrupted while doing their work, the y experience a decr ease in ener gy and productivity . Howe ver, a team led b y Harshad Pur anik, who studies management, has found that interruptions b y colleagues can have a social component that incr eases emplo yees’ sense of belonging, r esulting in gr eater job satisfaction that beneﬁts emplo yees and emplo yers. Ther efore, businesses should r ecogniz e that ______",
        "question": "Which choice most logically completes the text?",
        "options": ["the interpersonal beneﬁts of some interruptions in the workplace ma y offset the per ceived negativ e eff ects.","in or der t o maximiz e productivity , emplo yers should be willing t o interrupt emplo yees fr equently thr oughout the da y.","most emplo yees a void interrupting colleagues because the y don ’t appr eciate being interrupted themselv es.","in or der t o cultiv ate an ideal workplace envir onment, interruptions of work should be discour aged."],
        "answer": 0,
        "explanation": "Choice A is the best answer because it most logically completes the text’ s discussion of potential beneﬁts of interruptions in the workplace. The text indicates that a common belief in business is that interruptions t o working emplo yees decr ease ener gy and productivity le vels. Howe ver, the text goes on t o explain that a r esear ch team led b y Harshad Pur anik has found that ther e could be a social beneﬁt t o these interruptions.  Since the team found that workplace interruptions can incr ease emplo yees’ sense of belonging and job satisfaction, it follows that the interpersonal beneﬁts of some interruptions can offset the per ceived negativ e effects. Choice B is incorr ect. Although the text pr esents r esear ch ﬁndings that suggest some workplace interruptions can ha ve a positiv e effect on emplo yee job satisfaction, no fur ther information is pr esented t o suggest at what fr equency these interruptions ar e ideal. Furthermor e, the text doesn ’t tie workplace interruptions t o incr eased pr oductivity , but r ather links it t o social beneﬁts such as sense of belonging. Choice C is incorr ect because the text doesn ’t addr ess emplo yees’ motiv es for choosing not t o interrupt their colleagues. The text pr esents r esear ch ﬁndings that suggest that ther e are some positiv e interpersonal eff ects of workplace interruptions that can incr ease emplo yee job satisfaction. Choice D is incorr ect because asking businesses t o discour age workplace interruptions doesn ’t follow fr om the team ’s resear ch about the beneﬁts of workplace interruptions, nor does the text describe an ideal work envir onment. Instead, the text pr esents r esear ch suggesting that ther e ma y be positiv e aspects t o workplace interruptions that ha ven’t previously been consider ed.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-04cbeca3",
        "type": "Reading",
        "passage": "In 1534 CE, King Henr y VIII of England split with the Catholic Chur ch and declar ed himself head of the Chur ch of England, in par t because P ope Clement VII r efused t o annul his marriage t o Catherine of Ar agon. Two y ears later , Henr y VIII intr oduced a policy titled the Dissolution of the Monasteries that b y 1540 had r esulted in the closur e of all Catholic monasteries in England and the conﬁscation of their estates. Some hist orians asser t that the enactment of the policy was primarily motiv ated b y per ceived ﬁnancial oppor tunities.",
        "question": "Which quotation fr om a scholarly ar ticle best suppor ts the asser tion of the hist orians mentioned in the text?",
        "options": ["“At the time of the Dissolution of the Monasteries, about 2 per cent of the adult male population of England wer e monks; b y 1690, the pr opor tion of the adult male population who wer e monks was less than 1 per cent. ”","“A contempor ary description of the Dissolution of the Monasteries, Michael Sherbr ook’s Falle of the Religious Howses , recounts witness testimony that monks wer e allowed t o keep the contents of their cells and that the monaster y timber was purchased b y local y eomen. ”","“In 1535, the y ear befor e enacting the Dissolution of the Monasteries, Henr y commissioned a sur vey of the v alue of chur ch holdings in England—the work, per formed b y sheriffs, bishops, and magistr ates, began that Januar y and was swiftly completed by the summer .”","“The Oct ober 1536 r evolt known as the Pilgrimage of Gr ace had se veral economic motiv es: high food prices due t o a poor harvest the prior y ear; the Dissolution of the Monasteries, which closed r eliable sour ces of food and shelter for many; and r ents and tax es thr oughout Nor thern England that wer e not mer ely high but pr edat ory.”"],
        "answer": 2,
        "explanation": "Choice C is the best answer . The fact that Henr y VIII commissioned a sur vey of chur ch holdings just befor e enacting the Dissolution of the Monasteries suggests that he was inter ested in the potential pr oﬁts fr om claiming their assets. This suppor ts the hist orians’ asser tion. Choice A is incorr ect. This choice describes a potential eff ect of the Dissolution of the Monasteries. The decr ease in the propor tion of monks in England isn ’t relevant t o the question of Henr y VIII’ s motiv ations. Choice B is incorr ect. Details about how the monks wer e treated during the dissolution don ’t addr ess Henr y VIII’ s motiv ations for enacting the policy in the ﬁrst place. That the monks could k eep the content of their cells (their r ooms) and sell off the timber the y’d har vested has no impact on the v alue of the monasteries’ estates—their land holdings. Choice D is incorr ect. This choice mentions one impact that the Dissolution of the Monasteries contributed t o, two y ears after it happened. But it doesn ’t help explain why Henr y VIII might ha ve wanted t o enact the policy in the ﬁrst place.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-d5b9ed0d",
        "type": "Reading",
        "passage": "7 6 5 4 3 2 1 0Participants’ mean rating (1–9; higher values = more positive) Helpfulness of review Attitude toward reviewed productParticipants’ Responses to Three Review Conditions no anger (control) high anger low anger To understand how expr essions of anger in r eviews of pr oducts aff ect r eaders of those r eviews, business scholar Dezhi Yin and colleagues measur ed study par ticipants’ r esponses t o thr ee versions of the same negativ e review—a contr ol review expr essing no anger , a review expr essing a high degr ee of anger , and a r eview expr essing a low degr ee of anger . Reviewing the data, a student concludes that the mer e presence of anger in a r eview ma y not negativ ely aff ect r eaders’ per ceptions of the r eview , but a high degr ee of anger in a r eview does worsen r eaders’ per ceptions of the r eview .",
        "question": "Which choice best describes data fr om the gr aph that suppor t the students’ conclusion?",
        "options": ["On a verage, par ticipants’ r atings of the helpfulness of the r eview wer e substantially higher than wer e par ticipants’ r atings of the r eviewed pr oduct r egar dless of which type of r eview par ticipants had seen.","Compar ed with par ticipants who saw the contr ol review , par ticipants who saw the low-anger r eview r ated the r eview as slightly more helpful, wher eas par ticipants who saw the high-anger r eview r ated the r eview as less helpful.","Participants who saw the low-anger r eview r ated the r eview as slightly mor e helpful than par ticipants who saw the contr ol review did, but par ticipants’ attitude t owar d the r eviewed pr oduct was slightly worse when par ticipants saw the low-anger review than when the y saw the no-anger r eview . Assessment SATTest Reading and W ritingDomain Information and IdeasSkill Command of EvidenceDiﬃculty","Compar ed with par ticipants who saw the low-anger r eview , par ticipants who saw the high-anger r eview r ated the r eview as less helpful and had a less positiv e attitude t owar d the r eviewed pr oduct."],
        "answer": 1,
        "explanation": "Choice B is the best answer . The claim is that low anger does not negativ ely aff ect r eaders’ per ceptions of the r eview , while high anger does negativ ely aff ect r eaders’ per ceptions of the r eview . This choice accur ately expr esses the suppor ting data fr om the “helpfulness of r eview” par t of the gr aph: that low-anger r eviews wer e rated as slightly mor e helpful than no-anger r eviews, while high-anger r eviews wer e rated as less helpful than no-anger r eviews. Choice A is incorr ect. This choice does not suppor t the conclusion. The conclusion is only about how par ticipants f eel about the review itself—the par ticipants’ r atings of the r eviewed pr oduct ar e not r elevant. Choice C is incorr ect. This choice does not suppor t the conclusion. The conclusion is only about how par ticipants f eel about the r eview itself—the par ticipants’ attitude t owar ds the reviewed pr oduct is not r elevant. Choice D is incorr ect. This choice does not suppor t the conclusion. The conclusion is only about how par ticipants f eel about the r eview itself—the par ticipants’ attitude t owar ds the r eviewed pr oduct is not r elevant.",
        "difficulty": "Medium"
    },
    {
        "id": "em2-2fdfe002",
        "type": "Reading",
        "passage": "The following text is adapted fr om Countee Cullen ’s 1926 poem “Thoughts in a Z oo.” They in their cruel tr aps, and we in ours, Survey each other ’s rage, and pass the hours Commiser ating each the other ’s woe, To mitigate his own pain ’s ﬁer y glow . Man could but little pr offer in ex change Save that his cages ha ve a lar ger r ange. That lion with his lor dly, untamed hear t Has in some man his human counterpar t, Some lofty soul in dr eams and visions wr apped, But in the stiﬂing ﬂesh secur ely tr apped.",
        "question": "Based on the text, what challenge do humans sometimes experience?",
        "options": ["They cannot eff ectiv ely tame cer tain wild animals because of a lack of compassion.","They cannot focus on setting attainable goals because of a lack of motiv ation.","They quickly become frustr ated when faced with diﬃcult tasks because of a lack of self-contr ol.","They have aspir ations that cannot be fulﬁlled because of cer tain limitations."],
        "answer": 3,
        "explanation": "Choice D is the best answer . The text metaphorically lik ens humans t o animals in a z oo, suggesting that humans ha ve dreams that they cannot fulﬁll because the y are trapped. Choice A is incorr ect. The speak er sa ys that the lion has an “untamed hear t,” but the speak er doesn ’t actually mention anything about humans taming wild animals or a lack of compassion. Choice B is incorr ect. The speak er doesn ’t suggest that humans lack motiv ation. Rather , the speak er thinks that humans ar e “trapped” and pr evented fr om achie ving their dr eams. Choice C is incorr ect. The speak er doesn ’t mention anything about humans becoming frustr ated or lacking self-contr ol. Rather , the speak er thinks that humans ar e “trapped” and pr evented fr om achie ving their dr eams.",
        "difficulty": "Medium"
    }
];

export const practiceTests: PracticeTest[] = [
    {
        "id": 1,
        "title": "Practice Test 1",
        "description": "Full English SAT test",
        "type": "Full English",
        "duration": "1h 4m",
        "totalQuestions": 54,
        "moduleCount": 2,
        "color": "blue",
        "sections": [
            {
                "name": "Reading and Writing",
                "modules": [
                    {
                        "questions": [
                            {
                                "id": "e1-1",
                                "type": "Reading",
                                "passage": "[EM1Q1] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-2",
                                "type": "Reading",
                                "passage": "[EM1Q2] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-3",
                                "type": "Reading",
                                "passage": "[EM1Q3] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-4",
                                "type": "Reading",
                                "passage": "[EM1Q4] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-5",
                                "type": "Reading",
                                "passage": "[EM1Q5] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-6",
                                "type": "Reading",
                                "passage": "[EM1Q6] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-7",
                                "type": "Reading",
                                "passage": "[EM1Q7] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-8",
                                "type": "Reading",
                                "passage": "[EM1Q8] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-9",
                                "type": "Reading",
                                "passage": "[EM1Q9] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-10",
                                "type": "Reading",
                                "passage": "[EM1Q10] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-11",
                                "type": "Reading",
                                "passage": "[EM1Q11] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-12",
                                "type": "Reading",
                                "passage": "[EM1Q12] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-13",
                                "type": "Reading",
                                "passage": "[EM1Q13] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-14",
                                "type": "Reading",
                                "passage": "[EM1Q14] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-15",
                                "type": "Reading",
                                "passage": "[EM1Q15] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-16",
                                "type": "Reading",
                                "passage": "[EM1Q16] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-17",
                                "type": "Reading",
                                "passage": "[EM1Q17] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-18",
                                "type": "Reading",
                                "passage": "[EM1Q18] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-19",
                                "type": "Reading",
                                "passage": "[EM1Q19] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-20",
                                "type": "Reading",
                                "passage": "[EM1Q20] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-21",
                                "type": "Reading",
                                "passage": "[EM1Q21] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-22",
                                "type": "Reading",
                                "passage": "[EM1Q22] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-23",
                                "type": "Reading",
                                "passage": "[EM1Q23] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-24",
                                "type": "Reading",
                                "passage": "[EM1Q24] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-25",
                                "type": "Reading",
                                "passage": "[EM1Q25] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-26",
                                "type": "Reading",
                                "passage": "[EM1Q26] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-27",
                                "type": "Reading",
                                "passage": "[EM1Q27] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            }
                        ],
                        "timeMinutes": 32
                    },
                    {
                        "questions": [
                            {
                                "id": "e2-1",
                                "type": "Reading",
                                "passage": "[EM2Q1] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-2",
                                "type": "Reading",
                                "passage": "[EM2Q2] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-3",
                                "type": "Reading",
                                "passage": "[EM2Q3] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-4",
                                "type": "Reading",
                                "passage": "[EM2Q4] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-5",
                                "type": "Reading",
                                "passage": "[EM2Q5] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-6",
                                "type": "Reading",
                                "passage": "[EM2Q6] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-7",
                                "type": "Reading",
                                "passage": "[EM2Q7] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-8",
                                "type": "Reading",
                                "passage": "[EM2Q8] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-9",
                                "type": "Reading",
                                "passage": "[EM2Q9] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-10",
                                "type": "Reading",
                                "passage": "[EM2Q10] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-11",
                                "type": "Reading",
                                "passage": "[EM2Q11] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-12",
                                "type": "Reading",
                                "passage": "[EM2Q12] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-13",
                                "type": "Reading",
                                "passage": "[EM2Q13] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-14",
                                "type": "Reading",
                                "passage": "[EM2Q14] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-15",
                                "type": "Reading",
                                "passage": "[EM2Q15] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-16",
                                "type": "Reading",
                                "passage": "[EM2Q16] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-17",
                                "type": "Reading",
                                "passage": "[EM2Q17] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-18",
                                "type": "Reading",
                                "passage": "[EM2Q18] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-19",
                                "type": "Reading",
                                "passage": "[EM2Q19] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-20",
                                "type": "Reading",
                                "passage": "[EM2Q20] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-21",
                                "type": "Reading",
                                "passage": "[EM2Q21] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-22",
                                "type": "Reading",
                                "passage": "[EM2Q22] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-23",
                                "type": "Reading",
                                "passage": "[EM2Q23] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-24",
                                "type": "Reading",
                                "passage": "[EM2Q24] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-25",
                                "type": "Reading",
                                "passage": "[EM2Q25] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-26",
                                "type": "Reading",
                                "passage": "[EM2Q26] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-27",
                                "type": "Reading",
                                "passage": "[EM2Q27] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            }
                        ],
                        "timeMinutes": 32
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "title": "Practice Test 2",
        "description": "Full English SAT test",
        "type": "Full English",
        "duration": "1h 4m",
        "totalQuestions": 54,
        "moduleCount": 2,
        "color": "purple",
        "sections": [
            {
                "name": "Reading and Writing",
                "modules": [
                    {
                        "questions": [
                            {
                                "id": "e1-1",
                                "type": "Reading",
                                "passage": "[EM1Q1] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-2",
                                "type": "Reading",
                                "passage": "[EM1Q2] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-3",
                                "type": "Reading",
                                "passage": "[EM1Q3] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-4",
                                "type": "Reading",
                                "passage": "[EM1Q4] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-5",
                                "type": "Reading",
                                "passage": "[EM1Q5] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-6",
                                "type": "Reading",
                                "passage": "[EM1Q6] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-7",
                                "type": "Reading",
                                "passage": "[EM1Q7] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-8",
                                "type": "Reading",
                                "passage": "[EM1Q8] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-9",
                                "type": "Reading",
                                "passage": "[EM1Q9] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-10",
                                "type": "Reading",
                                "passage": "[EM1Q10] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-11",
                                "type": "Reading",
                                "passage": "[EM1Q11] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-12",
                                "type": "Reading",
                                "passage": "[EM1Q12] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-13",
                                "type": "Reading",
                                "passage": "[EM1Q13] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-14",
                                "type": "Reading",
                                "passage": "[EM1Q14] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-15",
                                "type": "Reading",
                                "passage": "[EM1Q15] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-16",
                                "type": "Reading",
                                "passage": "[EM1Q16] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-17",
                                "type": "Reading",
                                "passage": "[EM1Q17] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-18",
                                "type": "Reading",
                                "passage": "[EM1Q18] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-19",
                                "type": "Reading",
                                "passage": "[EM1Q19] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-20",
                                "type": "Reading",
                                "passage": "[EM1Q20] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-21",
                                "type": "Reading",
                                "passage": "[EM1Q21] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-22",
                                "type": "Reading",
                                "passage": "[EM1Q22] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-23",
                                "type": "Reading",
                                "passage": "[EM1Q23] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-24",
                                "type": "Reading",
                                "passage": "[EM1Q24] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-25",
                                "type": "Reading",
                                "passage": "[EM1Q25] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-26",
                                "type": "Reading",
                                "passage": "[EM1Q26] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-27",
                                "type": "Reading",
                                "passage": "[EM1Q27] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            }
                        ],
                        "timeMinutes": 32
                    },
                    {
                        "questions": [
                            {
                                "id": "e2-1",
                                "type": "Reading",
                                "passage": "[EM2Q1] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-2",
                                "type": "Reading",
                                "passage": "[EM2Q2] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-3",
                                "type": "Reading",
                                "passage": "[EM2Q3] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-4",
                                "type": "Reading",
                                "passage": "[EM2Q4] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-5",
                                "type": "Reading",
                                "passage": "[EM2Q5] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-6",
                                "type": "Reading",
                                "passage": "[EM2Q6] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-7",
                                "type": "Reading",
                                "passage": "[EM2Q7] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-8",
                                "type": "Reading",
                                "passage": "[EM2Q8] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-9",
                                "type": "Reading",
                                "passage": "[EM2Q9] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-10",
                                "type": "Reading",
                                "passage": "[EM2Q10] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-11",
                                "type": "Reading",
                                "passage": "[EM2Q11] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-12",
                                "type": "Reading",
                                "passage": "[EM2Q12] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-13",
                                "type": "Reading",
                                "passage": "[EM2Q13] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-14",
                                "type": "Reading",
                                "passage": "[EM2Q14] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-15",
                                "type": "Reading",
                                "passage": "[EM2Q15] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-16",
                                "type": "Reading",
                                "passage": "[EM2Q16] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-17",
                                "type": "Reading",
                                "passage": "[EM2Q17] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-18",
                                "type": "Reading",
                                "passage": "[EM2Q18] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-19",
                                "type": "Reading",
                                "passage": "[EM2Q19] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-20",
                                "type": "Reading",
                                "passage": "[EM2Q20] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-21",
                                "type": "Reading",
                                "passage": "[EM2Q21] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-22",
                                "type": "Reading",
                                "passage": "[EM2Q22] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-23",
                                "type": "Reading",
                                "passage": "[EM2Q23] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-24",
                                "type": "Reading",
                                "passage": "[EM2Q24] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-25",
                                "type": "Reading",
                                "passage": "[EM2Q25] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-26",
                                "type": "Reading",
                                "passage": "[EM2Q26] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-27",
                                "type": "Reading",
                                "passage": "[EM2Q27] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            }
                        ],
                        "timeMinutes": 32
                    }
                ]
            }
        ]
    },
    {
        "id": 3,
        "title": "Practice Test 3",
        "description": "Full English SAT test",
        "type": "Full English",
        "duration": "1h 4m",
        "totalQuestions": 54,
        "moduleCount": 2,
        "color": "blue",
        "sections": [
            {
                "name": "Reading and Writing",
                "modules": [
                    {
                        "questions": [
                            {
                                "id": "e1-1",
                                "type": "Reading",
                                "passage": "[EM1Q1] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-2",
                                "type": "Reading",
                                "passage": "[EM1Q2] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-3",
                                "type": "Reading",
                                "passage": "[EM1Q3] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-4",
                                "type": "Reading",
                                "passage": "[EM1Q4] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-5",
                                "type": "Reading",
                                "passage": "[EM1Q5] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-6",
                                "type": "Reading",
                                "passage": "[EM1Q6] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-7",
                                "type": "Reading",
                                "passage": "[EM1Q7] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-8",
                                "type": "Reading",
                                "passage": "[EM1Q8] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-9",
                                "type": "Reading",
                                "passage": "[EM1Q9] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-10",
                                "type": "Reading",
                                "passage": "[EM1Q10] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-11",
                                "type": "Reading",
                                "passage": "[EM1Q11] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-12",
                                "type": "Reading",
                                "passage": "[EM1Q12] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-13",
                                "type": "Reading",
                                "passage": "[EM1Q13] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-14",
                                "type": "Reading",
                                "passage": "[EM1Q14] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-15",
                                "type": "Reading",
                                "passage": "[EM1Q15] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-16",
                                "type": "Reading",
                                "passage": "[EM1Q16] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-17",
                                "type": "Reading",
                                "passage": "[EM1Q17] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-18",
                                "type": "Reading",
                                "passage": "[EM1Q18] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-19",
                                "type": "Reading",
                                "passage": "[EM1Q19] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-20",
                                "type": "Reading",
                                "passage": "[EM1Q20] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-21",
                                "type": "Reading",
                                "passage": "[EM1Q21] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-22",
                                "type": "Reading",
                                "passage": "[EM1Q22] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-23",
                                "type": "Reading",
                                "passage": "[EM1Q23] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-24",
                                "type": "Reading",
                                "passage": "[EM1Q24] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-25",
                                "type": "Reading",
                                "passage": "[EM1Q25] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-26",
                                "type": "Reading",
                                "passage": "[EM1Q26] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-27",
                                "type": "Reading",
                                "passage": "[EM1Q27] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            }
                        ],
                        "timeMinutes": 32
                    },
                    {
                        "questions": [
                            {
                                "id": "e2-1",
                                "type": "Reading",
                                "passage": "[EM2Q1] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-2",
                                "type": "Reading",
                                "passage": "[EM2Q2] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-3",
                                "type": "Reading",
                                "passage": "[EM2Q3] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-4",
                                "type": "Reading",
                                "passage": "[EM2Q4] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-5",
                                "type": "Reading",
                                "passage": "[EM2Q5] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-6",
                                "type": "Reading",
                                "passage": "[EM2Q6] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-7",
                                "type": "Reading",
                                "passage": "[EM2Q7] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-8",
                                "type": "Reading",
                                "passage": "[EM2Q8] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-9",
                                "type": "Reading",
                                "passage": "[EM2Q9] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-10",
                                "type": "Reading",
                                "passage": "[EM2Q10] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-11",
                                "type": "Reading",
                                "passage": "[EM2Q11] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-12",
                                "type": "Reading",
                                "passage": "[EM2Q12] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-13",
                                "type": "Reading",
                                "passage": "[EM2Q13] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-14",
                                "type": "Reading",
                                "passage": "[EM2Q14] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-15",
                                "type": "Reading",
                                "passage": "[EM2Q15] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-16",
                                "type": "Reading",
                                "passage": "[EM2Q16] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-17",
                                "type": "Reading",
                                "passage": "[EM2Q17] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-18",
                                "type": "Reading",
                                "passage": "[EM2Q18] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-19",
                                "type": "Reading",
                                "passage": "[EM2Q19] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-20",
                                "type": "Reading",
                                "passage": "[EM2Q20] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-21",
                                "type": "Reading",
                                "passage": "[EM2Q21] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-22",
                                "type": "Reading",
                                "passage": "[EM2Q22] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-23",
                                "type": "Reading",
                                "passage": "[EM2Q23] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-24",
                                "type": "Reading",
                                "passage": "[EM2Q24] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-25",
                                "type": "Reading",
                                "passage": "[EM2Q25] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-26",
                                "type": "Reading",
                                "passage": "[EM2Q26] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-27",
                                "type": "Reading",
                                "passage": "[EM2Q27] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            }
                        ],
                        "timeMinutes": 32
                    }
                ]
            }
        ]
    },
    {
        "id": 4,
        "title": "Practice Test 4",
        "description": "Full English SAT test",
        "type": "Full English",
        "duration": "1h 4m",
        "totalQuestions": 54,
        "moduleCount": 2,
        "color": "purple",
        "sections": [
            {
                "name": "Reading and Writing",
                "modules": [
                    {
                        "questions": [
                            {
                                "id": "e1-1",
                                "type": "Reading",
                                "passage": "[EM1Q1] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-2",
                                "type": "Reading",
                                "passage": "[EM1Q2] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-3",
                                "type": "Reading",
                                "passage": "[EM1Q3] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-4",
                                "type": "Reading",
                                "passage": "[EM1Q4] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-5",
                                "type": "Reading",
                                "passage": "[EM1Q5] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-6",
                                "type": "Reading",
                                "passage": "[EM1Q6] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-7",
                                "type": "Reading",
                                "passage": "[EM1Q7] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-8",
                                "type": "Reading",
                                "passage": "[EM1Q8] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-9",
                                "type": "Reading",
                                "passage": "[EM1Q9] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-10",
                                "type": "Reading",
                                "passage": "[EM1Q10] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-11",
                                "type": "Reading",
                                "passage": "[EM1Q11] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-12",
                                "type": "Reading",
                                "passage": "[EM1Q12] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-13",
                                "type": "Reading",
                                "passage": "[EM1Q13] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-14",
                                "type": "Reading",
                                "passage": "[EM1Q14] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-15",
                                "type": "Reading",
                                "passage": "[EM1Q15] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-16",
                                "type": "Reading",
                                "passage": "[EM1Q16] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-17",
                                "type": "Reading",
                                "passage": "[EM1Q17] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-18",
                                "type": "Reading",
                                "passage": "[EM1Q18] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-19",
                                "type": "Reading",
                                "passage": "[EM1Q19] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-20",
                                "type": "Reading",
                                "passage": "[EM1Q20] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-21",
                                "type": "Reading",
                                "passage": "[EM1Q21] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-22",
                                "type": "Reading",
                                "passage": "[EM1Q22] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-23",
                                "type": "Reading",
                                "passage": "[EM1Q23] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-24",
                                "type": "Reading",
                                "passage": "[EM1Q24] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-25",
                                "type": "Reading",
                                "passage": "[EM1Q25] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-26",
                                "type": "Reading",
                                "passage": "[EM1Q26] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-27",
                                "type": "Reading",
                                "passage": "[EM1Q27] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            }
                        ],
                        "timeMinutes": 32
                    },
                    {
                        "questions": [
                            {
                                "id": "e2-1",
                                "type": "Reading",
                                "passage": "[EM2Q1] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-2",
                                "type": "Reading",
                                "passage": "[EM2Q2] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-3",
                                "type": "Reading",
                                "passage": "[EM2Q3] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-4",
                                "type": "Reading",
                                "passage": "[EM2Q4] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-5",
                                "type": "Reading",
                                "passage": "[EM2Q5] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-6",
                                "type": "Reading",
                                "passage": "[EM2Q6] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-7",
                                "type": "Reading",
                                "passage": "[EM2Q7] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-8",
                                "type": "Reading",
                                "passage": "[EM2Q8] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-9",
                                "type": "Reading",
                                "passage": "[EM2Q9] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-10",
                                "type": "Reading",
                                "passage": "[EM2Q10] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-11",
                                "type": "Reading",
                                "passage": "[EM2Q11] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-12",
                                "type": "Reading",
                                "passage": "[EM2Q12] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-13",
                                "type": "Reading",
                                "passage": "[EM2Q13] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-14",
                                "type": "Reading",
                                "passage": "[EM2Q14] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-15",
                                "type": "Reading",
                                "passage": "[EM2Q15] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-16",
                                "type": "Reading",
                                "passage": "[EM2Q16] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-17",
                                "type": "Reading",
                                "passage": "[EM2Q17] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-18",
                                "type": "Reading",
                                "passage": "[EM2Q18] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-19",
                                "type": "Reading",
                                "passage": "[EM2Q19] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-20",
                                "type": "Reading",
                                "passage": "[EM2Q20] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-21",
                                "type": "Reading",
                                "passage": "[EM2Q21] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-22",
                                "type": "Reading",
                                "passage": "[EM2Q22] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-23",
                                "type": "Reading",
                                "passage": "[EM2Q23] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-24",
                                "type": "Reading",
                                "passage": "[EM2Q24] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-25",
                                "type": "Reading",
                                "passage": "[EM2Q25] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-26",
                                "type": "Reading",
                                "passage": "[EM2Q26] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-27",
                                "type": "Reading",
                                "passage": "[EM2Q27] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            }
                        ],
                        "timeMinutes": 32
                    }
                ]
            }
        ]
    },
    {
        "id": 5,
        "title": "Practice Test 5",
        "description": "Full English SAT test",
        "type": "Full English",
        "duration": "1h 4m",
        "totalQuestions": 54,
        "moduleCount": 2,
        "color": "blue",
        "sections": [
            {
                "name": "Reading and Writing",
                "modules": [
                    {
                        "questions": [
                            {
                                "id": "e1-1",
                                "type": "Reading",
                                "passage": "[EM1Q1] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-2",
                                "type": "Reading",
                                "passage": "[EM1Q2] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-3",
                                "type": "Reading",
                                "passage": "[EM1Q3] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-4",
                                "type": "Reading",
                                "passage": "[EM1Q4] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-5",
                                "type": "Reading",
                                "passage": "[EM1Q5] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-6",
                                "type": "Reading",
                                "passage": "[EM1Q6] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-7",
                                "type": "Reading",
                                "passage": "[EM1Q7] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-8",
                                "type": "Reading",
                                "passage": "[EM1Q8] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-9",
                                "type": "Reading",
                                "passage": "[EM1Q9] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-10",
                                "type": "Reading",
                                "passage": "[EM1Q10] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-11",
                                "type": "Reading",
                                "passage": "[EM1Q11] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-12",
                                "type": "Reading",
                                "passage": "[EM1Q12] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-13",
                                "type": "Reading",
                                "passage": "[EM1Q13] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-14",
                                "type": "Reading",
                                "passage": "[EM1Q14] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-15",
                                "type": "Reading",
                                "passage": "[EM1Q15] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-16",
                                "type": "Reading",
                                "passage": "[EM1Q16] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-17",
                                "type": "Reading",
                                "passage": "[EM1Q17] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-18",
                                "type": "Reading",
                                "passage": "[EM1Q18] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-19",
                                "type": "Reading",
                                "passage": "[EM1Q19] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-20",
                                "type": "Reading",
                                "passage": "[EM1Q20] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-21",
                                "type": "Reading",
                                "passage": "[EM1Q21] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-22",
                                "type": "Reading",
                                "passage": "[EM1Q22] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-23",
                                "type": "Reading",
                                "passage": "[EM1Q23] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-24",
                                "type": "Reading",
                                "passage": "[EM1Q24] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-25",
                                "type": "Reading",
                                "passage": "[EM1Q25] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-26",
                                "type": "Reading",
                                "passage": "[EM1Q26] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            },
                            {
                                "id": "e1-27",
                                "type": "Reading",
                                "passage": "[EM1Q27] The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.",
                                "question": "As used in the text, the word \"whispers\" most nearly means:",
                                "options": [
                                    "Quiet sounds",
                                    "Subtle suggestions",
                                    "Warnings",
                                    "Faint traces"
                                ],
                                "answer": 1,
                                "explanation": "In context, \"whispers\" metaphorically refers to subtle suggestions or hints.",
                                "difficulty": "Medium"
                            }
                        ],
                        "timeMinutes": 32
                    },
                    {
                        "questions": [
                            {
                                "id": "e2-1",
                                "type": "Reading",
                                "passage": "[EM2Q1] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-2",
                                "type": "Reading",
                                "passage": "[EM2Q2] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-3",
                                "type": "Reading",
                                "passage": "[EM2Q3] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-4",
                                "type": "Reading",
                                "passage": "[EM2Q4] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-5",
                                "type": "Reading",
                                "passage": "[EM2Q5] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-6",
                                "type": "Reading",
                                "passage": "[EM2Q6] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-7",
                                "type": "Reading",
                                "passage": "[EM2Q7] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-8",
                                "type": "Reading",
                                "passage": "[EM2Q8] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-9",
                                "type": "Reading",
                                "passage": "[EM2Q9] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-10",
                                "type": "Reading",
                                "passage": "[EM2Q10] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-11",
                                "type": "Reading",
                                "passage": "[EM2Q11] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-12",
                                "type": "Reading",
                                "passage": "[EM2Q12] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-13",
                                "type": "Reading",
                                "passage": "[EM2Q13] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-14",
                                "type": "Reading",
                                "passage": "[EM2Q14] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-15",
                                "type": "Reading",
                                "passage": "[EM2Q15] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-16",
                                "type": "Reading",
                                "passage": "[EM2Q16] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-17",
                                "type": "Reading",
                                "passage": "[EM2Q17] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-18",
                                "type": "Reading",
                                "passage": "[EM2Q18] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-19",
                                "type": "Reading",
                                "passage": "[EM2Q19] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-20",
                                "type": "Reading",
                                "passage": "[EM2Q20] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-21",
                                "type": "Reading",
                                "passage": "[EM2Q21] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-22",
                                "type": "Reading",
                                "passage": "[EM2Q22] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-23",
                                "type": "Reading",
                                "passage": "[EM2Q23] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-24",
                                "type": "Reading",
                                "passage": "[EM2Q24] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-25",
                                "type": "Reading",
                                "passage": "[EM2Q25] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-26",
                                "type": "Reading",
                                "passage": "[EM2Q26] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            },
                            {
                                "id": "e2-27",
                                "type": "Reading",
                                "passage": "[EM2Q27] The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.",
                                "question": "The primary purpose of the green roof is to:",
                                "options": [
                                    "Reduce building costs",
                                    "Provide a habitat and reduce heat",
                                    "Impress the city council",
                                    "Block out city noise"
                                ],
                                "answer": 1,
                                "explanation": "The passage mentions reducing the heat island effect and providing a habitat.",
                                "difficulty": "Easy"
                            }
                        ],
                        "timeMinutes": 32
                    }
                ]
            }
        ]
    },

    {
        id: 6,
        title: 'Practice Test 6',
        description: 'Full Section 2',
        type: 'Full Math',
        duration: '1h 10m',
        totalQuestions: 44,
        moduleCount: 2,
        color: 'orange',
        sections: [
            {
                name: 'Math',
                modules: [
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m1-${j + 1}`,
                            type: 'Math',
                            question: `[SM1Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["10...", "15...", "20...", "25..."],
                            answer: 1,
                            explanation: "Sample math explanation.",
                            difficulty: "Medium",
                            calc: true
                        }))
                    },
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m2-${j + 1}`,
                            type: 'Math',
                            question: `[SM2Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["1...", "2...", "3...", "4..."],
                            answer: 2,
                            explanation: "Sample math explanation.",
                            difficulty: "Hard",
                            calc: true
                        }))
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        title: 'Practice Test 7',
        description: 'Full Section 2',
        type: 'Full Math',
        duration: '1h 10m',
        totalQuestions: 44,
        moduleCount: 2,
        color: 'orange',
        sections: [
            {
                name: 'Math',
                modules: [
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m1-${j + 1}`,
                            type: 'Math',
                            question: `[SM1Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["10...", "15...", "20...", "25..."],
                            answer: 1,
                            explanation: "Sample math explanation.",
                            difficulty: "Medium",
                            calc: true
                        }))
                    },
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m2-${j + 1}`,
                            type: 'Math',
                            question: `[SM2Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["1...", "2...", "3...", "4..."],
                            answer: 2,
                            explanation: "Sample math explanation.",
                            difficulty: "Hard",
                            calc: true
                        }))
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        title: 'Practice Test 8',
        description: 'Full Section 2',
        type: 'Full Math',
        duration: '1h 10m',
        totalQuestions: 44,
        moduleCount: 2,
        color: 'orange',
        sections: [
            {
                name: 'Math',
                modules: [
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m1-${j + 1}`,
                            type: 'Math',
                            question: `[SM1Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["10...", "15...", "20...", "25..."],
                            answer: 1,
                            explanation: "Sample math explanation.",
                            difficulty: "Medium",
                            calc: true
                        }))
                    },
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m2-${j + 1}`,
                            type: 'Math',
                            question: `[SM2Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["1...", "2...", "3...", "4..."],
                            answer: 2,
                            explanation: "Sample math explanation.",
                            difficulty: "Hard",
                            calc: true
                        }))
                    }
                ]
            }
        ]
    },
    {
        id: 9,
        title: 'Practice Test 9',
        description: 'Full Section 2',
        type: 'Full Math',
        duration: '1h 10m',
        totalQuestions: 44,
        moduleCount: 2,
        color: 'orange',
        sections: [
            {
                name: 'Math',
                modules: [
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m1-${j + 1}`,
                            type: 'Math',
                            question: `[SM1Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["10...", "15...", "20...", "25..."],
                            answer: 1,
                            explanation: "Sample math explanation.",
                            difficulty: "Medium",
                            calc: true
                        }))
                    },
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m2-${j + 1}`,
                            type: 'Math',
                            question: `[SM2Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["1...", "2...", "3...", "4..."],
                            answer: 2,
                            explanation: "Sample math explanation.",
                            difficulty: "Hard",
                            calc: true
                        }))
                    }
                ]
            }
        ]
    },
    {
        id: 10,
        title: 'Practice Test 10',
        description: 'Full Section 2',
        type: 'Full Math',
        duration: '1h 10m',
        totalQuestions: 44,
        moduleCount: 2,
        color: 'orange',
        sections: [
            {
                name: 'Math',
                modules: [
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m1-${j + 1}`,
                            type: 'Math',
                            question: `[SM1Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["10...", "15...", "20...", "25..."],
                            answer: 1,
                            explanation: "Sample math explanation.",
                            difficulty: "Medium",
                            calc: true
                        }))
                    },
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: `m2-${j + 1}`,
                            type: 'Math',
                            question: `[SM2Q${j + 1}] This is a math question. Provide the correct answer based on the problem statement.`,
                            options: ["1...", "2...", "3...", "4..."],
                            answer: 2,
                            explanation: "Sample math explanation.",
                            difficulty: "Hard",
                            calc: true
                        }))
                    }
                ]
            }
        ]
    }
];

export const satDates = [
    { month: 'AUG', date: 'August 23, 2025', target: '2025-08-23T08:00:00', registrationDeadline: 'August 8, 2025', lateRegistrationDeadline: 'August 12, 2025', changeDeadline: 'August 12, 2025' },
    { month: 'SEP', date: 'September 13, 2025', target: '2025-09-13T08:00:00', registrationDeadline: 'August 29, 2025', lateRegistrationDeadline: 'September 2, 2025', changeDeadline: 'September 2, 2025' },
    { month: 'OCT', date: 'October 4, 2025', target: '2025-10-04T08:00:00', registrationDeadline: 'September 19, 2025', lateRegistrationDeadline: 'September 23, 2025', changeDeadline: 'September 23, 2025' },
    { month: 'NOV', date: 'November 8, 2025', target: '2025-11-08T08:00:00', registrationDeadline: 'October 24, 2025', lateRegistrationDeadline: 'October 28, 2025', changeDeadline: 'October 28, 2025' },
    { month: 'DEC', date: 'December 6, 2025', target: '2025-12-06T08:00:00', registrationDeadline: 'November 21, 2025', lateRegistrationDeadline: 'November 25, 2025', changeDeadline: 'November 25, 2025' },
    { month: 'MAR', date: 'March 14, 2026', target: '2026-03-14T08:00:00', registrationDeadline: 'February 27, 2026', lateRegistrationDeadline: 'March 3, 2026', changeDeadline: 'March 3, 2026' },
    { month: 'MAY', date: 'May 2, 2026', target: '2026-05-02T08:00:00', registrationDeadline: 'April 17, 2026', lateRegistrationDeadline: 'April 21, 2026', changeDeadline: 'April 21, 2026' },
    { month: 'JUN', date: 'June 6, 2026', target: '2026-06-06T08:00:00', registrationDeadline: 'May 22, 2026', lateRegistrationDeadline: 'May 26, 2026', changeDeadline: 'May 26, 2026' },
];

export const studyResources = [
    { id: 1, title: 'Grammar Rules Guide', description: 'Comprehensive guide to SAT grammar and punctuation rules.', category: 'English', icon: 'book-open', color: 'purple' },
    { id: 2, title: 'Reading Strategies', description: 'Techniques for active reading and passage analysis.', category: 'English', icon: 'eye', color: 'emerald' },
    { id: 3, title: 'SAT Vocabulary 500', description: 'Most frequently tested vocabulary words with examples.', category: 'English', icon: 'file-text', color: 'rose' },
];