"use strict"

const API_ENDPOINT = "https://api.cheats.rs";

let codes_rust = document.querySelectorAll("code:not(.ignore-auto)");
let subtitle_index = 0;
let all_tabs_expanded = false; // Set `true` by script if asked to expand tabs
let request_admin_count = 0;

const SKIP_FIRST_N_SUBTITLES = 2; // Skip first 2 entries

const subtitles = [
    "_NOW_HUMAN_",
    "_GITHASH_",
    "Same low price, 20% more content.",
    "Recommended by 9 out of 10 dentists.",
    "World's best cheat sheet according to its authors.",
    "This site was tested on animals and got 4.5 stars.",
    "Like Rust in a nutshell, for people with allergies.",
    "All the things you ever wanted to know. And more.",
    "A cargo-cult documentary.",
    "Will the last person switch on night mode?",
    "A collaboration between Zoo Berlin and Olympia Typewriters.",
    "Contains 2lbs of Rust per 1lbs of cheat sheet.",
    "Prints best on Dunder Mifflin cream letter stock.",
    "QA'ed with weekly 4h quality spot checks from Creed B.",
    "May contain R-rated content.",
    "Turned out the Señor Developer job wasn't much of a pay bump.",
    "Testing Bekenstein's limit one entry a time.",
    "Seven new dirty words: Undefined, runtime, inheritance, globals, unwrap, allocation, RIIR. JK on the last one.",
    "After Rust, learning German will be so much easier.",
    "Night mode is dark and full of errors.",
    "^Z^Z^Z^Z^X^quit:help! &mldr; how do I exit this thing?",
    "If it smells like rust and tastes like rust, it's probably not Rust.",
    "The R in ASMR stands for Rust.",
    "Chuck Norris doesn't fear concurrency. Concurrency fears Chuck Norris.",
    "Teaching endianness since 1820.",
    "Snugly fits the Bayeux tapestry.",
    "If a crab and a language love each other very much &mldr;",
    "I, for one, welcome our new AI overlords.",
    "As seen on interdimensional cable.",
    "I'm sure there's an X-File on the never type.",
    "${jndi:ldap://rustup.rs}",
    "A fractal guide to amorphous complexity.",
    "Roses had rust before it was cool.",
    "Blazingly fa&mldr; 🤚😣",
    "The sheet that really ties the room together.",
    "Rust be like: 'Computer says no &mldr;'",
    "Did you know, the Eiffel Tower is slowly rewritten in rust?",
    "Last time I wrote C feels like a lifetime ago &mldr;",
    "Can we borrow a minute of your time?",
    "Even for the Internet it's &mldr; pretty shocking.",
    "According to Einstein, humans use only 10% of their programming language.",
    "Fun fact, Rust appeared July 7, 2010, giving it the zodiac of the Crab ♋︎.",
    "Rumor has it there are languages with no concept of time.",
    "Tired of C++? Call (505) 142-4205 and request new dust filters for your Hoover Max Pressure Pro Model 60.",
    "Got crabs? Visit std.rs!",
    "World's worst cheat sheet, with the exception of all others.",
    "In a world of Rust, The Matrix would have been really short and depressing.",
    "Florida man transmutes lifetime, crashes app.",
    "It's pronounced Cheat She<span style='font-size:95%'>e</span><span style='font-size:90%'>e</span><span style='font-size:85%'>e</span><span style='font-size:80%'>e</span><span style='font-size:75%'>e</span><span style='font-size:70%'>t</span><span style='font-size:70%'>.</span>",
    "Arrival plot twist: the Heptapods needed help with lifetimes.",
    "The language with more drama than your prom.",
    "Also known as the Rust™️<sup>©️®️,not officially affiliated</sup> Language Cheat Sheet",
    "This is not the greatest cheat sheet in the world, no. This is just a tribute.",
    "To improve CI times this site will ship as a precompiled binary next week.",
    "Aquaaaa<sup>riiiiiii<sup style='font-size:85%;'>uuuuuuuuuuus</sup></sup>",
    "Rust is fast, somewhere between a snake and a mongoose.",
    "\"In the jungle, the mighty jungle, the lion sleeps tonight\" &mldr; Chorus: \"Async-await, async-await &mldr;\"",
    "Not great. Not terrible.",
    "Standing on the shoulders of hobbits.",
    "Everytime you type <span class='token keyword'>unsafe</span> the compiler secretly hums the James Bond theme.",
    "Fn traits &mldr; man, I tell ya'",
    "You get what you pay for.",
    "Look, nobody ever defined a size limit for cheat sheets.",
    "You could say my C++ skills have gotten a bit &mldr; rusty.",
    "You can't spell <i>trust</i> without <i>rust</i> &mldr; <strike>also frustra&mldr;</strike>",
];


// Labels for which we don't want feedback, mainly because the button placement
// would interfere with other buttons.
const feedback_blacklist = ["", "behind-the-scenes", "data-types", "numeric-types-ref", "textual-types-ref", "standard-library", "traits", "tooling", "coding-guides", "misc"];


/// Enables or disables the playground.
function show_playground(state) {
    let area_static = document.getElementById("hellostatic");
    let area_play = document.getElementById("helloplay");
    let area_ctrl = document.getElementById("helloctrl");
    let area_info = document.getElementById("helloinfo");

    if (state) {
        area_static.style.display = "none";
        area_info.style.display = "block";
        area_play.innerHTML = "<iframe src='https://play.rust-lang.org/' style='width:100%; height:500px;'></iframe>";
        area_ctrl.innerHTML = "<a href='javascript:show_playground(false);'>⏹️ Stop Editor</a>";
    } else {
        area_static.style.display = "block";
        area_info.style.display = "none";
        area_play.innerHTML = "";
        area_ctrl.innerHTML = "<a href='javascript:show_playground(true);'>▶️ Edit & Run</a>";
    }
}

// Called on page load, get the user's preference on night mode, either from storage or system settings.
function get_browser_night_mode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "night";
    } else {
        return "day";
    }
}

// Update the body's class that affects on either day or night mode, based on the given mode.
function set_body_night_mode(night_mode) {
    let body = document.getElementsByTagName("body")[0];
    if (night_mode === "night") {
        body.classList.add("night-mode");
        body.classList.remove("day-mode");
    } else {
        body.classList.remove("night-mode");
        body.classList.add("day-mode");
    }
}

// Called by toggle button, enable or disable night mode and persist setting in localStorage.
function toggle_night_mode() {
    let night_mode = storage_get("night-mode") || get_browser_night_mode();

    if (night_mode === "night") {
        night_mode = "day";
    } else {
        night_mode = "night";
    }

    storage_set("night-mode", night_mode);
    set_body_night_mode(night_mode);
}

// Called by toggle button, enable or disable ligatures persist setting in localStorage.
function toggle_ligatures() {
    let body = document.getElementsByTagName("body")[0];
    let set = undefined;

    if (!codes_rust || codes_rust.length == 0) return;

    if (codes_rust[0].style.fontVariantLigatures === "common-ligatures") {
        set = "none";
        storage_set("ligatures", "no-ligatures");
    } else {
        set = "common-ligatures";
        storage_set("ligatures", "ligatures");
    }

    codes_rust.forEach((code) => {
        code.style.fontVariantLigatures = set;
    });
}

// Opens or closes the blue box on top of the page.
function toggle_legend() {
    let short = document.querySelectorAll("symbol-legend.short")[0];
    let long = document.querySelectorAll("symbol-legend.long")[0];
    let href = document.querySelectorAll("blockquote.legend div a")[0]

    if (short.style.display == "" || short.style.display == "block") {
        short.style.display = "none";
        long.style.display = "block";
        href.text = "➖";
    } else {
        short.style.display = "block";
        long.style.display = "none";
        href.text = "➕";
    }
}


// Called by toggle button, enable or disable night mode and persist setting in localStorage.
function toggle_xray() {
    // Make visualization toggleable
    document.body.classList.toggle('xray-visible');

    // Cleanup existing xray visualizations if they exist so we can safely re-create them again
    document.querySelectorAll('.xray').forEach(el => el.remove());

    // Get all entries of our TOC (i.e., the list items containing a clickable link to the rest of the sheet)
    let toc_entries = document.querySelectorAll("toc li");

    fetch(`${API_ENDPOINT}/report/aggregates`)
        .then(response => response.json())
        .then(data => {
            // Now for each toc_entry, get statistics and render
            toc_entries.forEach(element => {
                // Get actual target of that href
                let link_href = element.childNodes[0].getAttribute("href");
                let section = link_href.split("#")[1];

                let stats = data[section];
                let width = (stats.positive + stats.negative) / 10;
                let percentage = 100 * stats.positive / (stats.positive + stats.negative);

                let stat_block = document.createElement("span");
                stat_block.className = "xray"
                stat_block.innerHTML = `
                    <sup>
                        <div style='background-color: red; width: ${width}px; height: 8px; display: inline-block; overflow: hidden; vertical-align: middle;'>
                            <div style='background-color: green; height: 100%; width: ${percentage}%;'></div>
                        </div>
                        <span style="color: green;">${stats.positive}</span> / <span style="color: red;">${stats.negative}</span> / ${stats.feedbacks}
                    </sup>
                `;
                element.append(stat_block)
            });
        })
        .catch(error => console.error('Error:', error));
}

// Show "admin" controls
function request_admin() {
    if (++request_admin_count == 5) {
        document.querySelectorAll('.admin').forEach(el => el.style.display = 'initial');
    }
}


// Called by toggle button, setting in localStorage.
function expand_all() {
    //
    // Expand all the tabs
    //
    let tabs = document.querySelectorAll("tab");
    for (let tab of tabs) {
        tab.style.display = "block";
    }

    let panels = document.querySelectorAll("tab > panel");
    for (let panel of panels) {
        panel.style.display = "initial";
    }

    let labels = document.querySelectorAll("tab > label");
    for (let label of labels) {
        label.style.display = "inline-block";
        // label.style.width = "100%";
        label.style.cursor = "initial";
        label.style.marginTop = "10px";
    }

    let inputs = document.querySelectorAll("tab > input");
    for (let input of inputs) {
        input.checked = false;
    }

    //
    // Expand all lifetime sections
    //
    let lifetime_explanations = document.querySelectorAll("lifetime-section > explanation");
    for (let le of lifetime_explanations) {
        le.style.display = "inherit";
    }

    //
    // Expand all types sections
    //
    let types_explanations = document.querySelectorAll("generics-section > description");
    for (let te of types_explanations) {
        te.style.display = "inherit";
    }
}


// Sets something to local storage.
function storage_set(key, value) {
    !!localStorage && localStorage.setItem(key, value);
}

// Retrieves something from local storage.
function storage_get(key) {
    return !!localStorage && localStorage.getItem(key);
}


// Called when the user clicks the subtitle (usually the date)
function advance_subtitle(to_index) {
    let subtitle = document.getElementById("subtitle");
    let subtitle_entry = "UNDEFINED";

    if (!!to_index) {
        // If called with specific index use that and stop thinking
        // about it.
        subtitle_entry = subtitles[to_index];
        subtitle_index = to_index;
    } else {
        // If not called with specific index (normal onclick behavior),
        // increase number.
        let next_possible_index = (subtitle_index + 1) % subtitles.length;

        // Is this now a follow-up entry?
        //
        // Yes: Show it.
        // No: Cycle back between the initial SKIP_FIRST_N_SUBTITLES.
        //
        // To figure out if follow-up entry, check if ("xxx", false) pair.

        subtitle_entry = subtitles[next_possible_index];

        if (subtitle_entry[1] === false) {
            // If that was a ("xxx", false) follow-up pair, get actual content and show.
            subtitle_index = next_possible_index;
            subtitle_entry = subtitle_entry[0];
        } else {
            // If was not a follow-up, rotate between first keys only.
            next_possible_index = next_possible_index % SKIP_FIRST_N_SUBTITLES;
            subtitle_index = next_possible_index;
            subtitle_entry = subtitles[next_possible_index];
        }
    }

    subtitle.innerHTML = subtitle_entry;
}

/// Shows a random quote
function random_quote() {
    let index = false;

    // Keep picking random numbers until we find some not a follow-up.
    while (index === false) {
        let rand = Math.random();

        index = SKIP_FIRST_N_SUBTITLES + Math.floor((subtitles.length - SKIP_FIRST_N_SUBTITLES) * rand);

        // If 2nd index was false we should ignore entry since it's follow up.
        if (subtitles[index][1] === false) {
            index = false;
        }
    }

    advance_subtitle(index);
}


// Performs the raw XHR call.
function json_post(op, json, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", API_ENDPOINT + op, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(json));
    xhr.onerror = (e) => { callback && callback("error") }
    xhr.onload = (e) => { callback && callback() }
}

// Submits text the user has written into the feedback form.
function feedback_send_detailed(feedback_id) {
    let feedback_node = document.getElementById(feedback_id);
    let element_id = feedback_node.getAttribute("element-id");

    let textarea = feedback_node.querySelectorAll(`textarea`)[0];
    let text = textarea.value;

    json_post("/feedback/detail", { text: text, section: element_id }, (e) => {
        let result = feedback_node.querySelectorAll(`result`)[0]
        if (!e) {
            textarea.value = null;
            result.innerHTML = "Success";
            result.style.color = "green";
            result.style.left = "40px";
            result.style.opacity = "0.0";

            setTimeout(() => {
                result.innerHTML = "";
                result.style.color = "black";
                result.style.left = "0px";
                result.style.opacity = "1.0";
            }, 500)
        } else {
            result.innerHTML = "Failed";
            result.style.color = "red";
        }
    });
}

// Prepares all forms visual effects for giving feedback
function feedback_send_mood(mood, feedback_id) {
    let feedback_node = document.getElementById(feedback_id);
    let element_id = feedback_node.getAttribute("element-id");

    let animation = feedback_node.querySelectorAll(`feedback-button.${mood} feedback-feedback`)[0];
    animation.style.visibility = "inherit";
    animation.style.top = "-3em";
    animation.style.opacity = "0.0";

    json_post("/feedback/mood", { mood: mood, section: element_id });

    setTimeout(() => {
        animation.style.visibility = "hidden";
        animation.style.top = "-0.5em";
        animation.style.opacity = "0.5";
    }, 300);
}

// Hide logic for feedback box needs various entities to call this.
function feedback_detail_visibility(feedback_id, visibility) {
    let feedback_node = document.getElementById(feedback_id);
    let form = feedback_node.querySelectorAll(`feedback-form`)[0];
    form.style.display = visibility;
}

// Handler to catch CTRL-ENTER
function feedback_quick_submit(feedback_id) {
    if (event.ctrlKey && event.keyCode == 13) {
        feedback_send_detailed(feedback_id);
    }
}

// Given a list of header tags, attach feedback buttons to that header.
function feedback_attach_buttons(list_of_header_tags) {
    for (let tagname of list_of_header_tags) {
        let elements = document.getElementsByTagName(tagname);

        for (let element of elements) {
            let element_id = element.id;
            let feedback_id = "feedback-" + element_id;
            let feedback = document.createElement("feedback");

            if (feedback_blacklist.includes(element_id)) continue;

            feedback.setAttribute("element-id", element_id);
            feedback.id = feedback_id;
            feedback.innerHTML = `
                <button-row>
                    <feedback-button class="good" onmouseover="feedback_detail_visibility('${feedback_id}', 'none')" onclick="javascript:feedback_send_mood('good', '${feedback_id}');"><feedback-feedback>💗</feedback-feedback><the-button>😊</the-button></feedback-button>
                    <feedback-button class="bad" onmouseover="feedback_detail_visibility('${feedback_id}', 'none')" onclick="javascript:feedback_send_mood('bad', '${feedback_id}');"><feedback-feedback>💩</feedback-feedback><the-button>😠</the-button></feedback-button>
                    <feedback-button onmouseover="feedback_detail_visibility('${feedback_id}', 'inherit')"><the-button>✏️</the-button></feedback-button>
                </button-row>
                <feedback-form>
                    <textarea maxlength="2048" onkeydown="javascript:feedback_quick_submit('${feedback_id}', this);" placeholder="Tell us more!"></textarea>
                    <hint>See <a href="/legal">privacy policy</a>; also <b>CTRL-ENTER</b> submits. </hint>
                    <controls>
                        <result></result>
                        <a href="javascript:feedback_send_detailed('${feedback_id}');">Submit</a>
                    </controls>
                </feedback-form>
            `;
            feedback.onmouseleave = () => {
                setTimeout(() => {
                    // Ok, problem is there are a few pixels where user's mouse will trigger
                    // "onmouseleave" but he actually only moved mouse to into detail box.
                    // The trick now is, we query for that ID with `:hover` state, if that
                    // element exists we know the user successfully hovered and don't do
                    // anything.
                    let is_still_hovered = document.querySelectorAll(`#${feedback_id}:hover`);
                    if (is_still_hovered.length > 0) return;

                    // Otherwise we hide the box.
                    feedback_detail_visibility(feedback_id, "none");
                }, 150);

            }

            element.appendChild(feedback);
        }
    }
}

// Make sure all "memory-bars" descriptions expand or collapse when clicked.
function memory_bars_expand_on_click() {
    let memory_bars = document.querySelectorAll("memory-row");

    for (let e of memory_bars) {
        e.onclick = (e) => {
            let section = e.target.closest("lifetime-section");
            let description = section.getElementsByTagName("explanation")[0];

            // Some elements just don't have any
            if (!description) return;

            if (!description.style.display || description.style.display == "none") {
                description.style.display = "inherit";
            } else {
                description.style.display = "none";
            }
        }
    }
}


// Make sure all "generics-section" expand when clicked.
function generics_section_expand_on_click() {
    let generics_section = document.querySelectorAll("generics-section > header");

    for (let e of generics_section) {
        e.onclick = (_) => {
            // Just expand the current one
            let description = e.parentElement.querySelector("description");

            if (!description.style.display || description.style.display == "none") {
                console.log(1)
                description.style.display = "inherit";
            } else {
                console.log(2)
                description.style.display = "none";
            }
        }
    }
}


// Use proper syntax since we don't want to write ````rust ...``` all the time.
codes_rust.forEach(code => {
    code.className = "language-rust";
});

// Run this after page had time to do first layout since these might take 1-2s, otherwise
// blocking page first render.
window.onload = () => {
    try {
        // Check if we have been asked to print
        if (window.location.hash == "#_print") {
            // In print mode, all we care for is to enable a few things
            toggle_ligatures();
            expand_all();

            // Have to set this to make CSS work for book
            set_body_night_mode("day");
        } else {
            // Executed on page load, this runs all toggles the user might have clicked
            // the last time based on localStorage.
            let ligatures = storage_get("ligatures");
            let night_mode = storage_get("night-mode") || get_browser_night_mode();

            // Don't attach feedback to h1, looks ugly and doesn't help.
            feedback_attach_buttons(["h2", "h3", "h4"]);

            if (Math.random() < 0.15) { random_quote(); }
            if (ligatures === "ligatures") { toggle_ligatures(); }

            set_body_night_mode(night_mode);

            // Make sure all interactive content works
            memory_bars_expand_on_click();
            generics_section_expand_on_click();

            json_post("/page/loaded", { referrer: document.referrer });
        }
    } catch (e) {
        console.log(e);
    }
};
