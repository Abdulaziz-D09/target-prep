#!/usr/bin/env python3
"""
Fix EBRW bank passages that contain chart/table data embedded as raw concatenated text.
We replace those passages with structured versions using a __TABLE__ marker format:
  __TABLE__
  Header1 | Header2 | Header3
  Row1Col1 | Row1Col2 | Row1Col3
  __ENDTABLE__
  Remaining passage text...
"""
import json
import sys

# Load the bank
import os
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BANK_PATH = os.path.join(SCRIPT_DIR, '..', 'src', 'data', 'ebrw_bank.json')

with open(BANK_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Map from question id -> fixed passage
FIXED_PASSAGES = {
    # Municipalities / election timing bar chart
    "a15b3219": (
        "__CHART__"
        "Municipalities' Responses to Inquiries about Potential Incentives for Firm Relocation"
        "\nThe bar chart shows three outcomes (no response, responded to inquiry, offered incentive)"
        "\nacross two announcement timing conditions (before election vs. after election)."
        "\nIn the 'before election' group: ~1,200 no response, ~200 responded, ~70 offered incentive."
        "\nIn the 'after election' group: ~1,250 no response, ~175 responded, ~60 offered incentive."
        "__ENDCHART__"
        "\nIn the United States, firms often seek incentives from municipal governments to expand to those municipalities. "
        "A team of political scientists hypothesized that municipalities are much more likely to respond to firms and offer "
        "incentives if expansions can be announced in time to benefit local elected officials than if they can't. "
        "The team contacted officials in thousands of municipalities, inquiring about incentives for a firm looking to expand "
        "and indicating that the firm would announce its expansion on a date either just before or just after the next election."
    ),

    # Gemini mission menus — actual table
    "75e07a4d": (
        "__TABLE__\n"
        "Food item | Day | Meal\n"
        "Sugar cookie cubes | 1 | B\n"
        "Chicken and vegetables | 2 | B\n"
        "Shrimp cocktail | 4 | C\n"
        "Hot cocoa | 3 | A\n"
        "__ENDTABLE__\n"
        "Sample of Food Items from Gemini Mission Menus\n"
        "To make sure they got the nutrition they needed while in space, the astronauts of NASA's Gemini missions were given "
        "menus for three meals a day (meals A, B, and C) on a four-day rotating schedule. Looking at the sample of food items "
        "from these menus, a student notes that on day 1, the menu included ______"
    ),

    # Economic Policy Uncertainty UK graph
    "702eb7e3": (
        "__CHART__"
        "Economic Policy Uncertainty in the United Kingdom, 2005–2010"
        "\nLine graph showing three uncertainty measures over time (2005–2010):"
        "\n- Tax and public spending policy uncertainty: starts low ~30 in 2005, rises sharply to ~175 by 2010"
        "\n- Trade policy uncertainty: starts high ~150 in 2005, drops to ~25 by 2010"
        "\n- General economic policy uncertainty: moderate ~80 in 2005, peaks ~120 around 2008–2009, ends ~90 in 2010"
        "\n(Higher values = more uncertainty)"
        "__ENDCHART__"
        "\nHigh levels of public uncertainty about which economic policies a country will adopt can make planning difficult "
        "for businesses, but measures of such uncertainty have not tended to be very detailed. Recently, however, economist "
        "Sandile Hlatshwayo analyzed trends in news reports to derive measures not only for general economic policy uncertainty "
        "but also for uncertainty related to specific areas of economic policy, like tax or trade policy. One revelation of her "
        "work is that a general measure may not fully reflect uncertainty about specific areas of policy, as in the case of "
        "the United Kingdom, where general economic policy uncertainty ______"
    ),

    # Lizard species bar graph
    "1281dfd5": (
        "__CHART__"
        "Number of Lizard Species by Average Percent of Maximal Speed Used When Pursuing Prey or Escaping Predators"
        "\nBar chart with two groups (pursuing prey / escaping predators) across speed ranges (30–39% to 90–100%)."
        "\nKey data points (approximate number of species per speed range):"
        "\n- 30–39%: pursuing ~3, escaping ~1"
        "\n- 40–49%: pursuing ~6, escaping ~2"
        "\n- 50–59%: pursuing ~8, escaping ~4"
        "\n- 60–69%: pursuing ~7, escaping ~6"
        "\n- 70–79%: pursuing ~5, escaping ~7"
        "\n- 80–89%: pursuing ~4, escaping ~8"
        "\n- 90–100%: pursuing ~2, escaping ~4"
        "__ENDCHART__"
        "\nIt may seem that the optimal strategy for an animal pursuing prey or escaping predators is to move at maximal speed, "
        "but the energy expense of exploiting full speed capacity can disfavor such a strategy even in escape contexts, "
        "as evidenced by the fact that ______"
    ),

    # Provo River / Jordanelle Dam graph
    "d83c3d54": (
        "__CHART__"
        "Characteristics of the Banks of the Provo River Downstream of the Jordanelle Dam"
        "\nBar chart showing area (square meters) for three categories across three years:"
        "__TABLE__\n"
        "Category | 1987 | 1993 | 2006\n"
        "Grass cover | ~38,000 | ~78,000 | ~130,000\n"
        "Bare soil | ~60,000 | ~50,000 | ~35,000\n"
        "Forest cover | ~75,000 | ~62,000 | ~50,000\n"
        "__ENDTABLE__"
        "__ENDCHART__"
        "\nThe Jordanelle Dam was built on the Provo River in Utah in 1992. Earth scientist Adriana E. Martinez and colleagues "
        "tracked changes to the environment on the banks of the river downstream of the dam, including how much grass and forest "
        "cover were present. They concluded that the dam changed the flow of the river in ways that benefited grass plants but "
        "didn't benefit trees."
    ),

    # Land area Antarctica — actual table
    "95388117": (
        "__TABLE__\n"
        "Species | Area covered in 2009 (sq m) | Area covered in 2018 (sq m) | Percent increase 2009–2018\n"
        "Deschampsia antarctica | 1,230 | 1,576 | 28%\n"
        "Colobanthus quitensis | 6.9 | 10.7 | 55%\n"
        "__ENDTABLE__\n"
        "Land Area Covered by Native Flowering Plants at a Site in Antarctica\n"
        "The only flowering plant species native to Antarctica, Colobanthus quitensis and Deschampsia antarctica grow in places "
        "where the earth remains free of ice for much of the year. Botanist Niccoletta Cannone wondered how the warming of "
        "Antarctica's climate in recent years had affected these species, so she visited a site in Antarctica, first in 2009 "
        "and later in 2018, to count the number of plants growing there. Cannone found that the area of land covered by the "
        "two species had significantly expanded during the nine-year period. While both species likely benefited from warming "
        "temperatures, Colobanthus quitensis ______"
    ),

    # Ondo State female farmers graph
    "403fb4e4": (
        "__CHART__"
        "Percentage of Ondo State Small-Scale Farmers Who Are Female, by Main Crop Grown"
        "\nBar chart showing female farmer percentage for three crop types across three regions:"
        "__TABLE__\n"
        "Region | Cereals | Root crops | Non-root vegetables\n"
        "North Ondo | ~28% | ~22% | ~57%\n"
        "Central Ondo | ~36% | ~20% | ~40%\n"
        "South Ondo | ~35% | ~30% | ~54%\n"
        "__ENDTABLE__"
        "__ENDCHART__"
        "\nGeographer Adebayo Oluwole Eludoyin and his colleagues surveyed small-scale farmers in three locations in Ondo State, "
        "Nigeria—which has mountainous terrain in the north, an urbanized center, and coastal terrain in the south—to learn "
        "more about their practices, like the types of crops they mainly cultivated. In some regions, female farmers were found "
        "to be especially prominent in the cultivation of specific types of crops and even constituted the majority of farmers "
        "who cultivated those crops; for instance, ______"
    ),

    # Pyramids table
    "0147b080": (
        "__TABLE__\n"
        "Pyramid | Country | Height (meters) | Age (years before present)\n"
        "The Great Pyramid | Mexico | 33 | 2,050 to 2,400\n"
        "The Pyramid of Djoser | Egypt | 60 | 4,600 to 4,700\n"
        "The Pyramid of Sahure | Egypt | 47 | 4,400 to 4,500\n"
        "El Castillo | Belize | 40 | 1,100 to 1,400\n"
        "__ENDTABLE__\n"
        "Pyramids in Egypt and the Americas\n"
        "A student is writing an essay about four pyramids for a history class and wants to note how long ago each pyramid "
        "was built and how tall each pyramid is. Consulting the table, the student finds that El Castillo was built 1,100 to "
        "1,400 years ago and is ______"
    ),

    # Banana ripening graph
    "040583a5": (
        "__CHART__"
        "Banana Ripening Time at Different Temperatures with and without Ethylene Treatment"
        "\nBar chart showing ripening time (days) for ethylene-treated vs. untreated bananas at four temperatures:"
        "__TABLE__\n"
        "Temperature | With ethylene (days) | Without ethylene (days)\n"
        "14°C | ~11 | ~12\n"
        "16°C | ~8 | ~10\n"
        "18°C | ~6 | ~8\n"
        "20°C | ~4 | ~5.5\n"
        "__ENDTABLE__"
        "__ENDCHART__"
        "\nA student is conducting an experiment to test the effect of temperature and ethylene treatment on the ripening speed "
        "of bananas. The student treated some bananas with ethylene while leaving others untreated, then allowed both types of "
        "bananas to ripen at one of four different temperatures. Comparing the data for bananas with and without ethylene, the "
        "student concluded that ______"
    ),

    # Nucleobases table
    "7a1877be": (
        "__TABLE__\n"
        "Nucleobase | Murchison sample 1 (ppb) | Murchison sample 2 (ppb) | Murchison soil (ppb)\n"
        "Isoguanine | 0.5 | 0.04 | not detected\n"
        "Purine | 0.2 | 0.02 | not detected\n"
        "Xanthine | 39 | 3 | 1\n"
        "Adenine | 15 | 1 | 40\n"
        "Hypoxanthine | 24 | 1 | 2\n"
        "__ENDTABLE__\n"
        "Nucleobase Concentrations from Murchison Meteorite and Soil Samples in Parts per Billion\n"
        "Employing high-performance liquid chromatography—a process that uses pressurized water to separate material into its "
        "component molecules—astrochemist Yashiro Oba and colleagues analyzed two samples of the Murchison meteorite that "
        "landed in Australia as well as soil from the landing zone of the meteorite to determine the concentrations of various "
        "organic molecules. By comparing the relative concentrations of types of molecules known as nucleobases in the Murchison "
        "meteorite with those in the soil, the team concluded that there is evidence that the nucleobases in the Murchison "
        "meteorite formed in space and are not the result of contamination on Earth."
    ),

    # LMC velocity table
    "bc7b1a04": (
        "__TABLE__\n"
        "Researchers | Study year | Estimated average velocity\n"
        "Murai and Fujimoto | 1980 | 344 km/s\n"
        "Gardiner and colleagues | 1994 | 297 km/s\n"
        "Kallivayalil and colleagues | 2006 | 378 km/s\n"
        "__ENDTABLE__\n"
        "Three Studies' Estimated Average Velocity of LMC\n"
        "In 2006, Nitya Kallivayalil and colleagues calculated the most accurate estimate yet of the average velocity (in "
        "kilometers per second) of the Large Magellanic Cloud (LMC) galaxy. Before the 2006 study, estimates of the average "
        "velocity were low enough for the LMC to maintain an orbit around the Milky Way galaxy, but according to an analysis "
        "by Gurtina Besla and colleagues, the estimated velocity from the 2006 study is too high for the LMC to maintain such "
        "an orbit. Therefore, if Besla and colleagues are correct, the maximum average velocity for the LMC that would allow "
        "it to maintain orbit around the Milky Way is likely ______"
    ),

    # Review anger graph
    "d5b9ed0d": (
        "__CHART__"
        "Participants' Responses to Three Review Conditions"
        "\nBar chart showing mean ratings (1–9 scale, higher = more positive) for two measures:"
        "__TABLE__\n"
        "Condition | Helpfulness of review | Attitude toward reviewed product\n"
        "No anger (control) | ~5.8 | ~4.2\n"
        "Low anger | ~6.1 | ~4.0\n"
        "High anger | ~4.5 | ~3.6\n"
        "__ENDTABLE__"
        "__ENDCHART__"
        "\nTo understand how expressions of anger in reviews of products affect readers of those reviews, business scholar "
        "Dezhi Yin and colleagues measured study participants' responses to three versions of the same negative review—a "
        "control review expressing no anger, a review expressing a high degree of anger, and a review expressing a low degree "
        "of anger. Reviewing the data, a student concludes that the mere presence of anger in a review may not negatively "
        "affect readers' perceptions of the review, but a high degree of anger in a review does worsen readers' perceptions "
        "of the review."
    ),
}

# Apply fixes
fixed_count = 0
for q in data:
    qid = q.get('id', '')
    if qid in FIXED_PASSAGES:
        q['passage'] = FIXED_PASSAGES[qid]
        fixed_count += 1
        print(f"Fixed: {qid}")

print(f"\nTotal fixed: {fixed_count}/{len(FIXED_PASSAGES)} questions")

# Save
with open(BANK_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved ebrw_bank.json successfully.")
