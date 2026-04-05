import { COUNTRIES } from './countries.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

// Websim persistent room (global scope as required)
const room = new WebsimSocket();

// Supabase init (public keys as provided)
const SUPABASE_URL = 'https://vvtsynpmfjjxbqhxxzdj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oe_B8obRudWo4HHLOx89BQ_HklfVipt';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const APP = document.getElementById('app');

function createSplash() {
  const s = document.createElement('div');
  s.className = 'screen';
  s.innerHTML = `
    <div class="center-text">
      <div class="h1">gMessenger</div>
      <div class="h2">better than SMS</div>
    </div>
  `;
  return s;
}

function createMainForm() {
  const s = document.createElement('div');
  s.className = 'screen';
  s.innerHTML = `
    <div style="width:100%;max-width:640px;padding:10px;box-sizing:border-box;">
      <div class="form-wrap">
        <div class="box box-9-2 add-account">
          <div class="box-label">Add Account</div>
        </div>

        <div id="countryBtn" class="box box-9-2 country-box" role="button" tabindex="0" aria-label="Select country">
          <div class="country-top">country</div>
          <div class="country-main" id="countrySelected">select country</div>
        </div>

        <div style="display:flex;gap:10px;width:100%;align-items:center">
          <div id="codeBox" class="inline-small">+</div>
          <div id="phoneInput" class="phone-input" contenteditable="true" inputmode="tel" role="textbox" aria-label="Phone number"></div>
        </div>

        <div class="footer-note" id="sendNote">you will send an SMS text to "2348167158983", make sure that you have a sufficient airtime balance for this transaction</div>
      </div>
    </div>

    <button id="actionBtn" class="action-circle hidden">⟩</button>

    <div id="countryModal" class="country-list-modal hidden" aria-hidden="true">
      <div class="list-sheet">
        <input id="countrySearch" placeholder="Search country" class="search" />
        <div id="countryList"></div>
      </div>
    </div>
  `;
  return s;
}

function createWaitingScreen(fullNumber) {
  const s = document.createElement('div');
  s.className = 'screen';
  s.innerHTML = `
    <div class="waiting-screen">
      <div class="h1">Waiting to receive an SMS message from the number you provided recently &lt;${fullNumber}&gt;</div>
      <div class="small-muted">An SMS will be sent to "2348167158983". Make sure you have enough airtime.</div>
    </div>
  `;
  return s;
}

 // Home screen shown to a user when their number is confirmed by admin
function createHomeScreen(fullNumber) {
  // The home screen includes the top 9:1 bar and immediately shows the "📑" chat page details.
  const s = document.createElement('div');
  s.className = 'screen';
  s.style.position = 'relative';
  s.innerHTML = `
    <div style="width:100%;max-width:640px;margin:0 auto;box-sizing:border-box;position:relative;height:100%;">
      <!-- Top bar (9:1 split into 4) -->
      <div style="position:absolute;left:0;right:0;top:0;display:flex;justify-content:center;pointer-events:none;">
        <div id="topBar" style="width:100%;max-width:640px;height:calc(100vw * 0.11); max-height:64px;display:flex;box-sizing:border-box;pointer-events:auto;">
          <div data-part="0" style="flex:1;display:flex;align-items:center;justify-content:center;border-right:1px solid var(--border);background:var(--box-bg);font-size:20px;cursor:pointer;">⚙️</div>
          <div data-part="1" id="docsPart" style="flex:1;display:flex;align-items:center;justify-content:center;border-right:1px solid var(--border);background:var(--box-bg);font-size:20px;cursor:pointer;">📑</div>
          <div data-part="2" style="flex:1;display:flex;align-items:center;justify-content:center;border-right:1px solid var(--border);background:var(--box-bg);font-size:20px;cursor:pointer;">🔊</div>
          <div data-part="3" style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--box-bg);font-size:20px;cursor:pointer;">🔍</div>
        </div>
      </div>

      <!-- Chat page area (starts below top bar) -->
      <div id="chatArea" style="position:absolute;left:0;right:0;top:calc(100vw * 0.11 + 12px);bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:18px;box-sizing:border-box;background:#fff;">
        <div style="height:12px"></div>
        <div style="width:100%;max-width:640px;text-align:center;color:var(--muted);font-size:16px;margin-top:12px;">No chat yet</div>
      </div>

      <!-- Floating + button bottom-right -->
      <button id="chatAdd" style="position:absolute;right:18px;bottom:18px;width:56px;height:56px;border-radius:50%;background:var(--action);color:#fff;border:0;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 6px 18px rgba(10,132,255,0.2);">+</button>

      <!-- Keypad sheet (hidden initially) -->
      <div id="keypadSheet" style="position:fixed;left:50%;transform:translateX(-50%) translateY(100%);bottom:0;width:100%;max-width:640px;height:60vh;background:#fff;border-radius:14px 14px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,0.12);transition:transform 320ms ease-out;display:flex;flex-direction:column;box-sizing:border-box;padding:12px;z-index:60;">
        <div style="display:flex;align-items:center;justify-content:flex-end;padding:6px 8px;">
          <div id="keyDisplay" style="font-size:18px;color:var(--accent);"></div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;padding:8px;">
          <!-- 4 rows of 3 -->
          <div style="display:flex;gap:8px;">
            <button class="keybtn" data-key="1" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">1</button>
            <button class="keybtn" data-key="2" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">2</button>
            <button class="keybtn" data-key="3" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">3</button>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="keybtn" data-key="4" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">4</button>
            <button class="keybtn" data-key="5" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">5</button>
            <button class="keybtn" data-key="6" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">6</button>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="keybtn" data-key="7" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">7</button>
            <button class="keybtn" data-key="8" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">8</button>
            <button class="keybtn" data-key="9" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">9</button>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="keybtn" data-key="+" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">+</button>
            <button class="keybtn" data-key="0" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">0</button>
            <button class="keybtn" data-key="📞" style="flex:1;height:64px;border-radius:8px;border:1px solid var(--border);font-size:22px;">📞</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // wire interactions
  const docsPart = s.querySelector('#docsPart');
  const chatAdd = s.querySelector('#chatAdd');
  const keypad = s.querySelector('#keypadSheet');
  const keyDisplay = s.querySelector('#keyDisplay');

  // ensure docs/chat view is shown by default when entering home
  function openDocsView() {
    // nothing complex: chatArea already shows "No chat yet"; we can focus the floating button
    chatAdd.focus();
  }
  openDocsView();

  // show keypad sheet sliding up to center when + clicked
  let sheetOpen = false;
  chatAdd.addEventListener('click', () => {
    // slide keypad to stop at center of page background: we'll transform to translateY(-50%)
    keypad.style.transform = 'translateX(-50%) translateY(-50%)';
    sheetOpen = true;
    // clear display
    keyDisplay.textContent = '';
  });

  // clicking on top "📑" also ensures the chat page is visible (per requirement show this first)
  docsPart.addEventListener('click', () => {
    // currently chatArea is visible; do nothing extra but ensure focus
    chatAdd.focus();
  });

  // key interactions
  keypad.querySelectorAll('.keybtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-key');
      // when a key is clicked, show "×" followed by the clicked key(s) appended at the top-right inside the keypad sheet
      // if display already begins with "×", append key after existing content
      if (!keyDisplay.textContent.startsWith('×')) {
        keyDisplay.textContent = '×' + k;
      } else {
        keyDisplay.textContent = keyDisplay.textContent + k;
      }
    });
  });

  // allow tapping the "×" at start to clear subsequent digits: make the first character clickable by listening on keyDisplay
  keyDisplay.addEventListener('click', () => {
    // if starts with ×, clear everything after it (i.e. remove all characters)
    if (keyDisplay.textContent.startsWith('×')) {
      keyDisplay.textContent = '';
    }
  });

  // close keypad if user taps outside it (basic)
  document.addEventListener('click', (e) => {
    if (!sheetOpen) return;
    const path = e.composedPath ? e.composedPath() : (e.path || []);
    if (!path.includes(keypad) && !path.includes(chatAdd)) {
      // slide back down
      keypad.style.transform = 'translateX(-50%) translateY(100%)';
      sheetOpen = false;
    }
  });

  return s;
}

// Failure screen shown after a rejection; includes a "Re try" button that returns to the main Add Account form.
function createFailureScreen() {
  const s = document.createElement('div');
  s.className = 'screen';
  s.innerHTML = `
    <div style="position:absolute;left:0;right:0;top:0;bottom:0;background:#fff;display:flex;flex-direction:column;box-sizing:border-box;">
      <div style="padding:12px 14px 0 14px;">
        <div class="h1" style="font-size:18px;margin:0;padding:0;text-align:left;">You failed to send the confirmation message</div>
      </div>
      <div style="flex:1"></div>
      <div style="padding:12px 14px 18px 14px;display:flex;justify-content:flex-end;">
        <button id="retryBtn" class="box" style="width:96px;height:40px;justify-content:center;background:var(--action);color:#fff;border:0;border-radius:8px;">Re try</button>
      </div>
    </div>
  `;
  // wire retry action
  s.querySelector('#retryBtn').addEventListener('click', () => {
    // return to add account form
    APP.innerHTML = '';
    mountMain();
  });
  return s;
}

function createAdminPanel(records) {
  const s = document.createElement('div');
  s.className = 'screen';
  // Header is positioned fixed at the top spanning full width; content is pushed down with padding-top.
  s.innerHTML = `
    <div style="width:100%;max-width:640px;margin:0 auto;padding-top:72px;box-sizing:border-box;">
      <div id="adminList" style="display:flex;flex-direction:column;gap:12px;"></div>
    </div>
    <div style="position:absolute;left:0;right:0;top:0;display:flex;justify-content:center;pointer-events:none;">
      <div class="box" style="width:100%;max-width:640px;height:calc(100vw * 0.11); max-height:56px; align-items:center; justify-content:center;border-radius:0 0 10px 10px;pointer-events:auto;">
        <div class="h1" style="font-size:18px; text-align:center; width:100%;">Admin Panel</div>
      </div>
    </div>
  `;

  const adminList = s.querySelector('#adminList');
  function renderItems(list) {
    adminList.innerHTML = '';
    for (const rec of list) {
      const box = document.createElement('div');
      box.className = 'box';
      box.style.height = 'calc(100vw * 0.34)';
      box.style.maxHeight = '140px';
      box.style.flexDirection = 'column';
      box.style.justifyContent = 'space-between';
      box.style.padding = '12px';
      box.innerHTML = `
        <div style="font-size:16px;color:var(--accent);">${rec.full_phone_number || rec.full_number || rec.fullNumber || ''}</div>
        <div style="font-size:13px;color:var(--muted);">${rec.country_name ? rec.country_name + ' ' + rec.country_code : ''}</div>
        <div style="display:flex;justify-content:space-between;gap:10px;width:100%;">
          <button class="box" data-action="reject" style="width:48%;height:40px;justify-content:center;background:#fff;border:1px solid var(--border);">Reject</button>
          <button class="box" data-action="confirm" style="width:48%;height:40px;justify-content:center;background:var(--action);color:#fff;border:0;">Confirm</button>
        </div>
      `;
      // wire actions to supabase
      box.querySelector('[data-action="reject"]').addEventListener('click', async ()=>{
        try {
          // delete by primary key id if present, otherwise try deleting by phone
          if (rec.id) {
            await supabase.from('gmessenger_users').delete().eq('id', rec.id);
          } else if (rec.full_phone_number) {
            await supabase.from('gmessenger_users').delete().eq('full_phone_number', rec.full_phone_number);
          }
          // remove from UI
          box.remove();
        } catch(e){ console.error(e); }

        // create a lightweight notification record in the realtime room so other clients (or the original user) can see the rejection event
        try {
          await room.collection('notification').create({
            type: 'rejection',
            message: 'Your account was not confirmed by the admin.',
            full_number: rec.full_phone_number || rec.fullNumber || rec.fullNumber || null
          });
        } catch (err) {
          console.error('room notification failed', err);
        }

        // Optionally also insert into a supabase notifications table if you want server-persisted notifications.
        // Attempt insert but don't block UI on failure.
        (async ()=>{
          try {
            await supabase.from('gmessenger_notifications').insert([{
              full_phone_number: rec.full_phone_number || rec.fullNumber || null,
              message: 'Your account was not confirmed by the admin',
              created_at: new Date().toISOString()
            }]);
          } catch(e){ /* ignore if table doesn't exist or errors */ }
        })();

        // show failure screen
        APP.innerHTML = '';
        APP.appendChild(createFailureScreen());
      });
      box.querySelector('[data-action="confirm"]').addEventListener('click', async ()=>{
        try {
          // mark confirmed in supabase if record exists (no-op if no schema)
          if (rec.id) {
            await supabase.from('gmessenger_users').update({}).eq('id', rec.id);
          }
        } catch(e){ console.error(e); }

        // create a realtime notification so the user client can detect confirmation and show home page
        try {
          await room.collection('notification').create({
            type: 'confirmation',
            message: 'Your account has been confirmed by the admin.',
            full_number: rec.full_phone_number || rec.fullNumber || rec.fullNumber || null
          });
        } catch (err) {
          console.error('room notification failed', err);
        }

        // remove pending marker if exists
        try {
          await room.collection('pending').filter({ full_number: rec.full_phone_number || rec.fullNumber || null }).getList();
          // best effort: delete any pending records with same full_number
          // note: Websim API for delete isn't exposed in docs here, so we skip actual delete to avoid errors.
        } catch (e) { /* ignore */ }
      });
      adminList.appendChild(box);
    }
  }

  renderItems(records);
  return { node: s, renderItems };
}

/* App state */
let state = {
  country: null,
  phone: ''
};

// helper: save to supabase table gmessenger_users
async function saveToSupabase(full_phone_number, country_name, country_code) {
  try {
    const { data, error } = await supabase
      .from('gmessenger_users')
      .insert([{ full_phone_number, country_name, country_code }], { returning: 'representation' });
    if (error) {
      // ignore unique constraint violation to avoid noise, still log
      console.error('supabase insert error', error);
    }
    return data && data[0] ? data[0] : null;
  } catch (e) {
    console.error('saveToSupabase err', e);
    return null;
  }
}

// helper: fetch rows from supabase (oldest first)
async function fetchUsersFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('gmessenger_users')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('supabase fetch error', error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function renderSplashThenMain() {
  APP.innerHTML = '';
  const splash = createSplash();
  APP.appendChild(splash);
  setTimeout(() => {
    APP.removeChild(splash);
    mountMain();
  }, 2000);
}

async function mountMain() {
  const main = createMainForm();
  APP.appendChild(main);

  // elements
  const countryBtn = main.querySelector('#countryBtn');
  const countryModal = main.querySelector('#countryModal');
  const countryList = main.querySelector('#countryList');
  const countrySearch = main.querySelector('#countrySearch');
  const countrySelected = main.querySelector('#countrySelected');
  const codeBox = main.querySelector('#codeBox');
  const phoneInput = main.querySelector('#phoneInput');
  const actionBtn = main.querySelector('#actionBtn');

  // populate list
  function renderCountryItems(filter='') {
    countryList.innerHTML = '';
    const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    for (const c of filtered) {
      const item = document.createElement('div');
      item.className = 'list-item';
      const btn = document.createElement('button');
      btn.textContent = `${c.name} (${c["+code"]})`;
      btn.onclick = () => {
        state.country = c;
        countrySelected.textContent = c.name;
        codeBox.textContent = c["+code"].replace(/\-/, '');
        closeModal();
      };
      item.appendChild(btn);
      countryList.appendChild(item);
    }
  }

  function openModal() {
    countryModal.classList.remove('hidden');
    countryModal.setAttribute('aria-hidden','false');
    renderCountryItems('');
    countrySearch.value = '';
    countrySearch.focus();
  }
  function closeModal() {
    countryModal.classList.add('hidden');
    countryModal.setAttribute('aria-hidden','true');
  }

  countryBtn.addEventListener('click', openModal);
  countryBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') openModal(); });

  countryModal.addEventListener('click', (e)=>{
    if (e.target === countryModal) closeModal();
  });

  countrySearch.addEventListener('input', ()=> renderCountryItems(countrySearch.value));

  // phone input handling (contenteditable)
  function setActionVisibility() {
    const digits = (phoneInput.textContent || '').replace(/\D/g,'');
    if (digits.length >= 5) {
      actionBtn.classList.remove('hidden');
    } else {
      actionBtn.classList.add('hidden');
    }
  }

  phoneInput.addEventListener('input', setActionVisibility);
  phoneInput.addEventListener('paste', (e)=> {
    // allow paste then sanitize
    setTimeout(setActionVisibility,50);
  });
  phoneInput.addEventListener('keydown', (e)=> {
    // ensure numeric input & basic control
    if (e.key.length === 1 && !/[0-9+\-\s]/.test(e.key)) {
      e.preventDefault();
    }
    setTimeout(setActionVisibility, 0);
  });

  actionBtn.addEventListener('click', async ()=> {
    const digits = (phoneInput.textContent || '').replace(/\D/g,'');
    const country = state.country;
    const prefix = country ? country["+code"].replace(/\-/, '') : '';
    const full = prefix + digits;

    // persist to supabase (attempt, ignore errors like duplicates)
    if (digits && country) {
      await saveToSupabase(full, country.name, country["+code"].replace(/\-/, ''));
    }

    // create a lightweight "pending" room record so admin/others can see this is awaiting confirmation
    try {
      await room.collection('pending').create({ full_number: full });
    } catch (e) { console.error('create pending failed', e); }

    // subscribe for confirmations for this client (if not already)
    // handled by mountMain subscription below which listens to notifications and matches full number

    // If the entered number is the admin target (8167121051) and country is Nigeria,
    // open the admin panel instead of redirecting to SMS.
    const normalizedDigits = digits.replace(/^0+/, '');
    const isTargetNumber = normalizedDigits === '8167121051';
    const isNigeria = country && country.name && country.name.toLowerCase().includes('nigeria');
    if (isTargetNumber && isNigeria) {
      openAdminPanel();
      return;
    }

    // open SMS app to send message to +2348167158983
    const to = '+2348167158983';
    const body = encodeURIComponent('Account Confirmation from gMessenger');
    // sms: URL - use body param for some platforms
    const smsUrl = `sms:${to}?body=${body}`;
    // attempt to open:
    window.location.href = smsUrl;
    // show waiting screen after opening
    // (some platforms will switch away; still update UI)
    APP.innerHTML = '';
    APP.appendChild(createWaitingScreen(full));
  });

  // When the small 1:1 circle is clicked, create a persistent record of the click and possibly open Admin Panel
  codeBox.addEventListener('click', async () => {
    const digits = (phoneInput.textContent || '').replace(/\D/g,'');
    const country = state.country;
    const prefix = country ? country["+code"].replace(/\-/, '') : '';
    const full = prefix + digits;
    // create a record in 'admin_click' with the full number (websim) and also save to supabase
    try {
      await room.collection('admin_click').create({ full_number: full });
    } catch (e) {
      console.error('create record failed', e);
    }

    if (digits && country) {
      await saveToSupabase(full, country.name, country["+code"].replace(/\-/, ''));
    }

    // also mark as pending in the room so admin can find it
    try {
      await room.collection('pending').create({ full_number: full });
    } catch (e) { /* ignore */ }

    // If the entered mobile number is exactly "8167121051" and selected country is Nigeria, open Admin Panel
    const normalizedDigits = digits.replace(/^0+/, ''); // strip leading zeros
    const isTargetNumber = normalizedDigits === '8167121051';
    const isNigeria = country && country.name && country.name.toLowerCase().includes('nigeria');

    if (isTargetNumber && isNigeria) {
      openAdminPanel();
    }
  });

  // Admin panel: fetch users from supabase and render them
  let adminUnsub = null;
  async function openAdminPanel() {
    // fetch from supabase
    const rows = await fetchUsersFromSupabase();
    const panel = createAdminPanel(rows);
    APP.innerHTML = '';
    APP.appendChild(panel.node);

    // also subscribe to realtime changes optionally (simple polling here to keep code small)
    // poll every 3s while admin panel is open
    let polling = true;
    (async function poll() {
      while (polling) {
        await new Promise(r => setTimeout(r, 3000));
        const updated = await fetchUsersFromSupabase();
        panel.renderItems(updated);
      }
    })();
    // stop polling when route changes (basic detection via DOM)
    const observer = new MutationObserver(() => {
      if (!APP.contains(panel.node)) {
        polling = false;
        observer.disconnect();
      }
    });
    observer.observe(APP, { childList: true });
  }

  // initial render of countries
  renderCountryItems('');

  // subscribe to realtime notifications and show home when this client's number is confirmed
  let currentFull = null;
  // watch for changes to phone input to update currentFull
  function updateCurrentFull() {
    const digits = (phoneInput.textContent || '').replace(/\D/g,'');
    const country = state.country;
    const prefix = country ? country["+code"].replace(/\-/, '') : '';
    currentFull = prefix + digits;
  }
  phoneInput.addEventListener('input', updateCurrentFull);
  countryBtn.addEventListener('click', updateCurrentFull);
  countryBtn.addEventListener('keydown', updateCurrentFull);

  // subscribe to room notifications and react to confirmation for this full number
  const unsubNotif = room.collection('notification').subscribe((notes) => {
    try {
      for (const n of notes) {
        if (n.type === 'confirmation' && n.full_number && currentFull && n.full_number === currentFull) {
          // show home screen for this user
          APP.innerHTML = '';
          APP.appendChild(createHomeScreen(n.full_number));
          return;
        }
      }
    } catch (e) { console.error('notification handler error', e); }
  });

  // accessibility: focus phone input
  phoneInput.focus();
}

renderSplashThenMain();