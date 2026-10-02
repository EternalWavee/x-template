/*
 * X-Template
 * Author: Hengtao Wu (EternalWavee)
 * License: MIT
 *
 * Interactions, bilingual copy, video embedding, and citation utilities.
 */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel) {
    return document.querySelector(sel);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function timecode(sec) {
    var s = Math.max(0, Math.floor(sec));
    return pad(Math.floor(s / 60)) + ":" + pad(s % 60);
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  function pick(value, lang) {
    return value && typeof value === "object" ? value[lang] || value.en : value;
  }

  var DICT = {
    en: {
      "brand-title": "X-Template",
      "title-rest": "A Bilingual Research Showcase You Can Make Your Own",
      tagline: "Present your paper, demo, architecture, results, and citation in one polished page.",
      affil: "[Lab or Department], [Institution]",
      "s-abstract": "Abstract",
      abstract: "[Introduce the research problem, explain why it matters, and state the central idea of your approach. Aim for 3–5 sentences.]",
      "abstract-2": "[Summarize the main technical contribution, the strongest result, and the practical takeaway. Include only claims supported by the paper.]",
      "s-demo": "Live demo",
      "demo-led": "[Explain what the demo shows, what input it uses, and what visitors should pay attention to.]",
      "tab-replay": "Session replay",
      "tab-video": "Video",
      "track-conv": "Primary flow",
      "track-task": "Secondary flow",
      "replay-caption": "<b>How to read it.</b> Explain what each track represents and how the events relate to one another.",
      "video-note": "Set the Bilibili video id on this frame to embed the demo.",
      "card-1-t": "[First contribution title]",
      "card-1-p": "[Explain the first contribution in one or two concise sentences.]",
      "card-2-t": "[Second contribution title]",
      "card-2-p": "[Explain the second contribution and how it improves on prior work.]",
      "card-3-t": "[Third contribution title]",
      "card-3-p": "[Explain the third contribution and its practical significance.]",
      "s-arch": "System architecture",
      "arch-led": "[Explain how the major components of the method fit together.]",
      "arch-caption": "[Describe the key design choice or data flow illustrated above.]",
      "s-eval": "Evaluation",
      "eval-led": "[List the research questions, datasets, baselines, and evaluation protocol used to support the paper's claims.]",
      "th-metric": "Metric",
      "th-protocol": "How it is measured",
      "th-result": "Result",
      "ev-1-name": "[Primary metric]",
      "ev-1-proto": "[Define the metric and evaluation setting]",
      "ev-2-name": "[Secondary metric]",
      "ev-2-proto": "[Define the metric and comparison protocol]",
      "ev-3-name": "[Robustness metric]",
      "ev-3-proto": "[Describe the stress-test setting]",
      "ev-4-name": "[Ablation study]",
      "ev-4-proto": "[Name the component or design choice being ablated]",
      "ev-5-name": "[Human evaluation]",
      "ev-5-proto": "[Describe the annotation criteria and procedure]",
      "st-pending": "[Result]",
      "eval-note": "[Add any qualifications needed to interpret the reported results.]",
      "s-cite": "Citation",
      "cta-title": "Welcome to X-Template",
      "cta-p": "Replace the guided placeholders with your own research content, links, figures, and visual identity.",
      "cta-code": "Start customizing",
      "cta-demo": "Review the sections",
      "cta-closing": "Keep the sections you need, remove the ones you do not, and publish the result as a static website.",
      "foot-lab": "Made for clear and engaging research communication",
      play: "Play session replay",
      pause: "Pause session replay"
    },
    zh: {
      "brand-title": "X-Template",
      "title-rest": "一个可自由定制的双语研究展示页面",
      tagline: "用一个精致的页面展示论文、演示、系统架构、实验结果与引用信息。",
      affil: "[实验室或院系]，[机构名称]",
      "s-abstract": "摘要",
      abstract: "[介绍研究问题，说明其重要性，并概述核心方法。建议使用 3–5 句话。]",
      "abstract-2": "[总结主要技术贡献、最强实验结果和实际意义。仅填写论文中有证据支持的结论。]",
      "s-demo": "实时演示",
      "demo-led": "[说明演示展示了什么、使用了什么输入，以及访客应重点关注什么。]",
      "tab-replay": "会话重演",
      "tab-video": "视频",
      "track-conv": "主流程",
      "track-task": "辅助流程",
      "replay-caption": "<b>如何阅读。</b>说明每条轨道表示什么，以及各个事件之间的关系。",
      "video-note": "在此处填入 Bilibili 视频 id 即可嵌入演示。",
      "card-1-t": "[填写第一项贡献的标题]",
      "card-1-p": "[用一到两句话简洁说明第一项贡献。]",
      "card-2-t": "[填写第二项贡献的标题]",
      "card-2-p": "[说明第二项贡献及其相对已有工作的改进。]",
      "card-3-t": "[填写第三项贡献的标题]",
      "card-3-p": "[说明第三项贡献及其实际意义。]",
      "s-arch": "系统架构",
      "arch-led": "[说明方法中的主要组件如何协同工作。]",
      "arch-caption": "[说明上图展示的关键设计选择或数据流。]",
      "s-eval": "评测",
      "eval-led": "[列出支持论文结论的研究问题、数据集、基线方法和评测协议。]",
      "th-metric": "指标",
      "th-protocol": "测量方式",
      "th-result": "结果",
      "ev-1-name": "[填写主要指标]",
      "ev-1-proto": "[定义指标和评测设置]",
      "ev-2-name": "[填写次要指标]",
      "ev-2-proto": "[定义指标和对比协议]",
      "ev-3-name": "[填写鲁棒性指标]",
      "ev-3-proto": "[说明压力测试设置]",
      "ev-4-name": "[填写消融实验]",
      "ev-4-proto": "[填写被消融的组件或设计选择]",
      "ev-5-name": "[填写人工评测]",
      "ev-5-proto": "[说明标注标准和评测流程]",
      "st-pending": "[填写结果]",
      "eval-note": "[补充解读实验结果所需的限定条件。]",
      "s-cite": "引用",
      "cta-title": "欢迎使用 X-Template",
      "cta-p": "将引导式占位内容替换为你的研究介绍、链接、图片和视觉标识。",
      "cta-code": "开始定制",
      "cta-demo": "查看页面结构",
      "cta-closing": "保留需要的章节，删除不需要的部分，然后将成品作为静态网站发布。",
      "foot-lab": "为清晰、生动的学术成果展示而设计",
      play: "播放会话重演",
      pause: "暂停会话重演"
    }
  };

  var lang = "en";
  var replayApi = null;

  function applyLanguage(next) {
    if (!DICT[next] || next === lang) return;
    lang = next;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    var nodes = document.querySelectorAll("[data-i18n]");
    Array.prototype.forEach.call(nodes, function (el) {
      var value = DICT[lang][el.getAttribute("data-i18n")];
      if (value != null) el.textContent = value;
    });

    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    Array.prototype.forEach.call(htmlNodes, function (el) {
      var value = DICT[lang][el.getAttribute("data-i18n-html")];
      if (value != null) el.innerHTML = value;
    });

    if (replayApi) replayApi.rebuild();
  }

  var langToggle = $(".lang-toggle");
  var langEn = $("#lang-en");
  var langZh = $("#lang-zh");
  var thumb = $(".lang-thumb");

  function moveThumb(button) {
    if (!thumb || !button) return;
    thumb.style.width = button.offsetWidth + "px";
    // the thumb's own left inset equals the toggle's padding (a clamp that
    // shrinks on small screens), so read it instead of hard-coding 3
    var inset = parseFloat(getComputedStyle(thumb).left) || 0;
    thumb.style.transform = "translateX(" + (button.offsetLeft - inset) + "px)";
  }

  function setLanguage(next) {
    var target = next === "zh" ? langZh : langEn;
    if (!target) return;
    langEn.classList.toggle("active", target === langEn);
    langZh.classList.toggle("active", target === langZh);
    moveThumb(target);
    applyLanguage(next);
  }

  if (langEn && langZh) {
    moveThumb(langEn);
    // place the thumb before transitions are enabled, so opening or refreshing
    // the page never plays a slide-in animation
    requestAnimationFrame(function () {
      if (langToggle) langToggle.classList.add("is-ready");
    });
    // re-measure once webfonts settle, otherwise the thumb can be a hair off
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        moveThumb(langZh.classList.contains("active") ? langZh : langEn);
      });
    }
    langEn.addEventListener("click", function () {
      setLanguage("en");
    });
    langZh.addEventListener("click", function () {
      setLanguage("zh");
    });
    window.addEventListener("resize", function () {
      moveThumb(langZh.classList.contains("active") ? langZh : langEn);
    });
  }

  var hero = $(".hero-bg");
  var heroLocked = 0;

  function lockHeroHeight() {
    if (!hero) return 0;
    hero.style.minHeight = ""; // measure the natural, content-driven height
    var h = hero.offsetHeight;
    if (h > 0) hero.style.minHeight = h + "px";
    return h;
  }

  if (hero) {
    heroLocked = lockHeroHeight();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        // the first measurement can predate webfont metrics
        if (langZh && langZh.classList.contains("active")) return;
        heroLocked = lockHeroHeight() || heroLocked;
      });
    }
    window.addEventListener("resize", function () {
      if (langZh && langZh.classList.contains("active")) {
        // while 中文 is active the natural height is the shorter one, so reuse
        // the last English measurement instead of re-locking to 中文
        hero.style.minHeight = heroLocked ? heroLocked + "px" : "";
      } else {
        heroLocked = lockHeroHeight() || heroLocked;
      }
    });
  }

  var videoFrame = $("#video-frame");
  if (videoFrame) {
    var bvid = (videoFrame.getAttribute("data-bvid") || "").trim();
    if (bvid) {
      var frame = document.createElement("iframe");
      frame.src =
        "https://player.bilibili.com/player.html?bvid=" +
        encodeURIComponent(bvid) +
        "&page=1&high_quality=1&danmaku=0&autoplay=0";
      frame.title = "Embedded demonstration video";
      frame.setAttribute("scrolling", "no");
      frame.setAttribute("frameborder", "0");
      frame.setAttribute("allowfullscreen", "true");
      frame.setAttribute("allow", "fullscreen; autoplay");
      var holder = $("#video-placeholder");
      if (holder) holder.remove();
      videoFrame.appendChild(frame);
    }
  }


  var dataEl = $("#replay-data");
  if (dataEl && $("#stage")) {
    try {
      replayApi = buildReplay(JSON.parse(dataEl.textContent));
    } catch (err) {
      console.error("Session replay data could not be parsed:", err);
    }
  }

  function buildReplay(data) {
    var stage = $("#stage");
    var spine = $("#spine");
    var head = $("#playhead");
    var play = $("#play");
    var scrub = $("#scrub");
    var speedBtn = $("#speed");
    var nowEl = $("#tc-now");
    var totalEl = $("#tc-total");

    var duration = data.duration;
    var events = data.events.slice().sort(function (a, b) {
      return a.t - b.t;
    });

    totalEl.textContent = timecode(duration);

    var ICON_PLAY = "M8 5l11 7-11 7z";
    var ICON_PAUSE = "M7 5h3v14H7zM14 5h3v14h-3z";
    var ICON_RESTART = "M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z";

    var FIRST_ROW = 2; // row 1 holds the column labels
    var rows = [];


    function renderEvents() {
      // drop previously generated nodes so a language switch is clean
      Array.prototype.forEach.call(
        stage.querySelectorAll(".ev, .ev-time, .band"),
        function (el) {
          el.remove();
        }
      );

      rows = [];
      var bandRow = null;
      var lastTaskRow = null;

      events.forEach(function (ev, i) {
        var row = FIRST_ROW + i;
        var node = document.createElement("div");

        if (ev.track === "task") {
          node.className = "ev ev-task";
          node.innerHTML =
            '<span class="ev-role-tool">' +
            escapeHtml(ev.tool) +
            "</span>" +
            '<span class="ev-title">' +
            escapeHtml(pick(ev.title, lang)) +
            "</span>" +
            (ev.note
              ? '<span class="ev-note">' + escapeHtml(pick(ev.note, lang)) + "</span>"
              : "");
          if (data.band && ev.t === data.band.start) bandRow = row;
          if (data.band && ev.t <= data.band.end) lastTaskRow = row;
        } else {
          var isUser = ev.role === "user";
          node.className = "ev ev-conv " + (isUser ? "is-user" : "is-agent");
          node.innerHTML =
            '<span class="who">' +
            (isUser ? (lang === "zh" ? "你" : "You") : "Demo") +
            ' <span class="ev-when">' +
            timecode(ev.t) +
            "</span></span>" +
            escapeHtml(pick(ev.text, lang));
        }

        node.style.gridRow = String(row);
        node.dataset.t = String(ev.t);
        stage.appendChild(node);

        var stamp = document.createElement("span");
        stamp.className = "ev-time";
        stamp.textContent = timecode(ev.t);
        stamp.style.gridRow = String(row);
        stage.appendChild(stamp);

        rows.push({ t: ev.t, el: node });
      });

      // the spine spans every row so the playhead can travel the timeline
      var lastRow = FIRST_ROW + events.length - 1;
      spine.style.gridRow = "1 / span " + lastRow;

      // the continuous band across the whole task lifetime
      if (data.band && bandRow !== null && lastTaskRow !== null) {
        var band = document.createElement("div");
        band.className = "band";
        band.innerHTML =
          '<span class="band-label"><span class="live"></span>' +
          escapeHtml(pick(data.band.label, lang)) +
          "</span>";
        band.style.gridRow =
          bandRow + " / span " + (lastTaskRow - bandRow + 1);
        stage.insertBefore(band, stage.children[2]);
      }
    }


    var marks = [];

    function measure() {
      if (window.innerWidth <= 640) {
        marks = [];
        return;
      }
      var base = spine.getBoundingClientRect().top;
      marks = rows.map(function (row) {
        var r = row.el.getBoundingClientRect();
        return { t: row.t, y: r.top + r.height / 2 - base };
      });
    }


    var time = 0;
    var playing = false;
    var armed = false; // becomes true on first interaction
    var speeds = [1, 6, 12];
    var speedIndex = Math.max(0, speeds.indexOf(data.speed || 6));
    var lastFrame = 0;

    speedBtn.textContent = speeds[speedIndex] + "\u00d7";

    function headY(t) {
      if (!marks.length) return 0;
      if (t <= marks[0].t) {
        var first = marks[0];
        return first.t > 0 ? (t / first.t) * first.y : first.y;
      }
      for (var i = 0; i < marks.length - 1; i++) {
        var a = marks[i];
        var b = marks[i + 1];
        if (t >= a.t && t <= b.t) {
          var k = b.t === a.t ? 1 : (t - a.t) / (b.t - a.t);
          return a.y + (b.y - a.y) * k;
        }
      }
      return marks[marks.length - 1].y;
    }

    function render() {
      nowEl.textContent = timecode(time);
      var pct = (time / duration) * 100;
      scrub.value = String(pct);
      scrub.style.setProperty("--p", pct.toFixed(2) + "%");

      Array.prototype.forEach.call(stage.querySelectorAll(".ev"), function (el) {
        var t = parseFloat(el.dataset.t);
        el.classList.toggle("is-pending", armed && t > time + 0.05);
      });

      if (marks.length) {
        head.style.top = headY(time) + "px";
      }
      head.classList.toggle("is-on", armed && marks.length > 0);
    }

    function setIcon(path) {
      play.querySelector("path").setAttribute("d", path);
    }

    function setAria() {
      play.setAttribute(
        "aria-label",
        playing ? DICT[lang].pause : DICT[lang].play
      );
    }

    function tick(now) {
      if (!playing) return;
      if (!lastFrame) lastFrame = now;
      var dt = (now - lastFrame) / 1000;
      lastFrame = now;
      time = Math.min(duration, time + dt * speeds[speedIndex]);
      render();
      if (time >= duration) {
        stop(true);
        return;
      }
      requestAnimationFrame(tick);
    }

    function start() {
      if (time >= duration) time = 0;
      playing = true;
      armed = true;
      lastFrame = 0;
      setIcon(ICON_PAUSE);
      setAria();
      requestAnimationFrame(tick);
    }

    function stop(finished) {
      playing = false;
      setIcon(finished ? ICON_RESTART : ICON_PLAY);
      setAria();
    }

    play.addEventListener("click", function () {
      measure();
      if (playing) stop(false);
      else start();
    });

    scrub.addEventListener("input", function () {
      armed = true;
      time = (parseFloat(scrub.value) / 100) * duration;
      measure();
      render();
      if (playing) lastFrame = 0;
    });

    speedBtn.addEventListener("click", function () {
      speedIndex = (speedIndex + 1) % speeds.length;
      speedBtn.textContent = speeds[speedIndex] + "\u00d7";
      if (playing) lastFrame = 0;
    });

    window.addEventListener("resize", function () {
      measure();
      render();
    });

    renderEvents();
    render();

    return {
      rebuild: function () {
        renderEvents();
        measure();
        render();
        setAria();
      }
    };
  }

  var copyBtn = $("#copy-bib");
  var bibtex = $("#bibtex");

  if (copyBtn && bibtex && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(bibtex.textContent).then(
        function () {
          copyBtn.textContent = "Copied";
          setTimeout(function () {
            copyBtn.textContent = "Copy";
          }, 1600);
        },
        function () {
          copyBtn.textContent = "Select manually";
        }
      );
    });
  }
})();
