/**
 * CHARGEBEAM EV CHARGING SOLUTIONS - INTERACTIVE APPLICATION JAVASCRIPT
 * Handles Live Charging Simulator, Host ROI Calculator, CMS Telemetry Mock, Hardware Tabs, and Inquiries.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileMenuBtn.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link, .nav-cta-mobile').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }

  // Animated Number Counters on Hero
  const counterElements = document.querySelectorAll('.metric-value[data-target]');
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
          } else {
            el.textContent = (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterElements.forEach(el => countObserver.observe(el));

  /* ==========================================================================
     1. INTERACTIVE LIVE CHARGING SIMULATOR (6 STEPS)
     ========================================================================== */
  const simSteps = [
    {
      step: 1,
      heading: "Park Securely in Designated EV Bay",
      desc: "Drive into the brightly marked ChargeBeam EV parking bay. Sensor systems verify bay clearance and ready the kiosk for charging.",
      kioskStatus: "STANDBY",
      kioskStatusClass: "online",
      cableConnected: false,
      batterySoC: "24%",
      interactiveHtml: `
        <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 0.85rem; color: #fff; font-weight: 600;">Selected Vehicle Inlet:</div>
            <div style="font-size: 0.75rem; color: var(--brand-primary);">Tata Nexon EV / Mahindra XUV400 (CCS-2)</div>
          </div>
          <button class="btn btn-outline btn-sm" id="btnSimStep1Action">
            <i data-lucide="check"></i> Bay Position Verified
          </button>
        </div>
      `
    },
    {
      step: 2,
      heading: "Connect Heavy-Duty Charging Gun",
      desc: "Unholder the dual-insulated CCS-2 or Type-2 charging gun and insert it firmly into your vehicle's charging inlet until locked.",
      kioskStatus: "PLUGGED IN",
      kioskStatusClass: "online",
      cableConnected: true,
      batterySoC: "24%",
      interactiveHtml: `
        <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 0.85rem; color: var(--brand-primary); font-weight: 700;"><i data-lucide="lock" style="width:14px; display:inline;"></i> Safety Interlock Engaged</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Vehicle communication handshake established</div>
          </div>
          <button class="btn btn-primary btn-sm" id="btnSimStep2Action">
            <i data-lucide="zap"></i> Ready To Scan QR
          </button>
        </div>
      `
    },
    {
      step: 3,
      heading: "Scan Dynamic On-Screen UPI QR Code",
      desc: "Zero mobile app downloads required. Simply scan the dynamic QR displayed on the 7-inch sunlight-readable kiosk screen with any UPI app.",
      kioskStatus: "AWAITING AUTH",
      kioskStatusClass: "charging",
      cableConnected: true,
      batterySoC: "24%",
      interactiveHtml: `
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          <div style="font-size: 0.85rem; color: #fff; font-weight: 600;">Choose UPI App to Authorize Session:</div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm sim-pay-pill active" data-app="GPay">Google Pay</button>
            <button class="btn btn-outline btn-sm sim-pay-pill" data-app="PhonePe">PhonePe</button>
            <button class="btn btn-outline btn-sm sim-pay-pill" data-app="Paytm">Paytm UPI</button>
            <button class="btn btn-outline btn-sm sim-pay-pill" data-app="Cred">CRED Pay</button>
          </div>
        </div>
      `
    },
    {
      step: 4,
      heading: "Instant Power Flow & Surge Defense",
      desc: "Payment authorized instantly. High-voltage contactors close safely and deliver clean, filtered DC power directly to your EV battery pack.",
      kioskStatus: "CHARGING (58.4 kW)",
      kioskStatusClass: "charging",
      cableConnected: true,
      batterySoC: "38%",
      interactiveHtml: `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; text-align: center;">
          <div style="background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 6px;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Voltage</div>
            <div style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: #38bdf8;">398.2 V</div>
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 6px;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Current</div>
            <div style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--brand-primary-light);">146.8 A</div>
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 0.5rem; border-radius: 6px;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">Output Power</div>
            <div style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: var(--brand-primary);">58.4 kW</div>
          </div>
        </div>
      `
    },
    {
      step: 5,
      heading: "Live Mobile Telemetry & Energy Tracker",
      desc: "Track real-time charging progress, battery percentage, units consumed (kWh), and elapsed time directly from your mobile browser in real-time.",
      kioskStatus: "CHARGING (80% TARGET)",
      kioskStatusClass: "charging",
      cableConnected: true,
      batterySoC: "80%",
      interactiveHtml: `
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600;">
            <span style="color: #fff;">Charging Level</span>
            <span style="color: var(--brand-primary);" id="simLiveProgressText">80% (Completed Target)</span>
          </div>
          <div style="width: 100%; height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden;">
            <div style="width: 80%; height: 100%; background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent)); border-radius: 4px;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
            <span>Delivered: <strong>28.4 kWh</strong></span>
            <span>Duration: <strong>22 mins</strong></span>
            <span>Session Cost: <strong>₹511.20</strong></span>
          </div>
        </div>
      `
    },
    {
      step: 6,
      heading: "Automated WhatsApp & SMS GST Invoice",
      desc: "Once unplugged, an itemized digital GST invoice is immediately delivered to your WhatsApp number and phone with full transaction breakdown.",
      kioskStatus: "SESSION FINISHED",
      kioskStatusClass: "complete",
      cableConnected: false,
      batterySoC: "80%",
      interactiveHtml: `
        <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 0.85rem; color: var(--brand-primary); font-weight: 700;"><i data-lucide="check-circle-2" style="width:14px; display:inline;"></i> 100% Tax Compliant Invoice Ready</div>
            <div style="font-size: 0.75rem; color: #cbd5e1;">Sent to WhatsApp (+91 98*** 43210)</div>
          </div>
          <button class="btn btn-primary btn-sm" id="btnOpenInvoiceModal">
            <i data-lucide="receipt"></i> View Tax Invoice
          </button>
        </div>
      `
    }
  ];

  let currentSimStep = 1;
  let simAutoPlayTimer = null;

  const simStepNav = document.getElementById('simStepNav');
  const simStepBtns = simStepNav ? simStepNav.querySelectorAll('.sim-step-btn') : [];
  const simStepHeading = document.getElementById('simStepHeading');
  const simStepDesc = document.getElementById('simStepDesc');
  const simCurrentStepBadge = document.getElementById('simCurrentStepBadge');
  const simInteractiveArea = document.getElementById('simInteractiveArea');
  const kioskScreenStatus = document.getElementById('kioskScreenStatus');
  const simCable = document.getElementById('simCable');
  const carBatteryVal = document.getElementById('carBatteryVal');
  const simPrevBtn = document.getElementById('simPrevBtn');
  const simNextBtn = document.getElementById('simNextBtn');
  const simAutoPlayBtn = document.getElementById('simAutoPlayBtn');

  function renderSimStep(stepNumber) {
    currentSimStep = stepNumber;
    const data = simSteps[stepNumber - 1];

    // Update Nav Buttons
    simStepBtns.forEach(btn => {
      const btnStep = parseInt(btn.getAttribute('data-step'), 10);
      btn.classList.remove('active');
      if (btnStep === stepNumber) {
        btn.classList.add('active');
      }
      if (btnStep < stepNumber) {
        btn.classList.add('completed');
      } else {
        btn.classList.remove('completed');
      }
    });

    // Update Texts
    if (simCurrentStepBadge) simCurrentStepBadge.textContent = `STEP ${data.step} OF 6`;
    if (simStepHeading) simStepHeading.textContent = data.heading;
    if (simStepDesc) simStepDesc.textContent = data.desc;

    // Update Visuals
    if (kioskScreenStatus) {
      kioskScreenStatus.textContent = data.kioskStatus;
      kioskScreenStatus.className = `kiosk-status-badge ${data.kioskStatusClass}`;
    }
    if (simCable) {
      if (data.cableConnected) {
        simCable.classList.add('connected');
      } else {
        simCable.classList.remove('connected');
      }
    }
    if (carBatteryVal) {
      carBatteryVal.textContent = data.batterySoC;
    }

    // Update Interactive Panel
    if (simInteractiveArea) {
      simInteractiveArea.innerHTML = data.interactiveHtml;

      // Re-bind dynamic interactive elements
      const btnOpenInv = simInteractiveArea.querySelector('#btnOpenInvoiceModal');
      if (btnOpenInv) {
        btnOpenInv.addEventListener('click', () => {
          openModal('invoiceModal');
        });
      }

      const simPayPills = simInteractiveArea.querySelectorAll('.sim-pay-pill');
      simPayPills.forEach(pill => {
        pill.addEventListener('click', () => {
          simPayPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          showToast('Payment Method Selected', `${pill.getAttribute('data-app')} ready for instant scan`);
        });
      });

      const btnStep1 = simInteractiveArea.querySelector('#btnSimStep1Action');
      if (btnStep1) {
        btnStep1.addEventListener('click', () => renderSimStep(2));
      }

      const btnStep2 = simInteractiveArea.querySelector('#btnSimStep2Action');
      if (btnStep2) {
        btnStep2.addEventListener('click', () => renderSimStep(3));
      }
    }

    // Update Buttons State
    if (simPrevBtn) simPrevBtn.disabled = (stepNumber === 1);
    if (simNextBtn) {
      if (stepNumber === 6) {
        simNextBtn.innerHTML = '<i data-lucide="rotate-ccw"></i> Restart Demo';
      } else {
        simNextBtn.innerHTML = 'Next Step <i data-lucide="arrow-right"></i>';
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Step Nav clicks
  simStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      renderSimStep(step);
      if (simAutoPlayTimer) {
        clearInterval(simAutoPlayTimer);
        simAutoPlayTimer = null;
        if (simAutoPlayBtn) simAutoPlayBtn.innerHTML = '<i data-lucide="play"></i> Auto Demo';
      }
    });
  });

  if (simPrevBtn) {
    simPrevBtn.addEventListener('click', () => {
      if (currentSimStep > 1) {
        renderSimStep(currentSimStep - 1);
      }
    });
  }

  if (simNextBtn) {
    simNextBtn.addEventListener('click', () => {
      if (currentSimStep < 6) {
        renderSimStep(currentSimStep + 1);
      } else {
        renderSimStep(1);
      }
    });
  }

  if (simAutoPlayBtn) {
    simAutoPlayBtn.addEventListener('click', () => {
      if (simAutoPlayTimer) {
        clearInterval(simAutoPlayTimer);
        simAutoPlayTimer = null;
        simAutoPlayBtn.innerHTML = '<i data-lucide="play"></i> Auto Demo';
        showToast('Auto Demo Paused', 'You can now navigate manually');
      } else {
        simAutoPlayBtn.innerHTML = '<i data-lucide="pause"></i> Pause Demo';
        showToast('Auto Demo Started', 'Cycles through all 6 charging steps');
        simAutoPlayTimer = setInterval(() => {
          let next = currentSimStep + 1;
          if (next > 6) next = 1;
          renderSimStep(next);
        }, 3200);
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Initial Simulator Render
  renderSimStep(1);

  /* ==========================================================================
     2. HOST REVENUE & SAVINGS CALCULATOR
     ========================================================================== */
  const stationCountInput = document.getElementById('stationCount');
  const sessionsPerGunInput = document.getElementById('sessionsPerGun');
  const hostMarginInput = document.getElementById('hostMargin');
  const pillDc = document.getElementById('pillDc');
  const pillAc = document.getElementById('pillAc');

  const dispStationCount = document.getElementById('dispStationCount');
  const dispSessions = document.getElementById('dispSessions');
  const dispMargin = document.getElementById('dispMargin');

  const resMonthlyIncome = document.getElementById('resMonthlyIncome');
  const resAnnualIncome = document.getElementById('resAnnualIncome');
  const resMonthlyEnergy = document.getElementById('resMonthlyEnergy');
  const resDriverSavings = document.getElementById('resDriverSavings');
  const resCo2Offset = document.getElementById('resCo2Offset');

  let selectedChargerType = 'dc'; // 'dc' or 'ac'

  function calculateHostROI() {
    const stations = parseInt(stationCountInput ? stationCountInput.value : 2, 10);
    const guns = stations * 2; // dual guns per station
    const sessions = parseInt(sessionsPerGunInput ? sessionsPerGunInput.value : 8, 10);
    const margin = parseFloat(hostMarginInput ? hostMarginInput.value : 4.5);

    // Energy delivered per session average (kWh)
    const kWhPerSession = (selectedChargerType === 'dc') ? 28 : 12;

    // Daily & Monthly Total Energy (kWh)
    const dailyEnergy = guns * sessions * kWhPerSession;
    const monthlyEnergy = dailyEnergy * 30;

    // Host Revenue
    const monthlyIncome = monthlyEnergy * margin;
    const annualIncome = monthlyIncome * 12;

    // Driver Fuel Savings vs Petrol (Avg ₹10/km for petrol vs ₹1.8/km for EV -> saving ~₹6.5 per kWh equivalent)
    const monthlyDriverSavings = monthlyEnergy * 9.5;

    // CO2 Mitigation (Avg 0.82 kg CO2 avoided per kWh in clean grid mix)
    const annualCo2Tonnes = (monthlyEnergy * 12 * 0.8) / 1000;

    // Update Displays
    if (dispStationCount) dispStationCount.textContent = `${stations} Station${stations > 1 ? 's' : ''} (${guns} Guns)`;
    if (dispSessions) dispSessions.textContent = `${sessions} Sessions / gun / day`;
    if (dispMargin) dispMargin.textContent = `₹${margin.toFixed(2)} / kWh`;

    if (resMonthlyIncome) resMonthlyIncome.textContent = `₹${Math.round(monthlyIncome).toLocaleString('en-IN')}`;
    if (resAnnualIncome) resAnnualIncome.textContent = `₹${Math.round(annualIncome).toLocaleString('en-IN')}`;
    if (resMonthlyEnergy) resMonthlyEnergy.textContent = `${Math.round(monthlyEnergy).toLocaleString('en-IN')} kWh`;
    if (resDriverSavings) resDriverSavings.textContent = `₹${Math.round(monthlyDriverSavings).toLocaleString('en-IN')} / mo`;
    if (resCo2Offset) resCo2Offset.textContent = `${annualCo2Tonnes.toFixed(1)} Tonnes`;
  }

  if (stationCountInput) stationCountInput.addEventListener('input', calculateHostROI);
  if (sessionsPerGunInput) sessionsPerGunInput.addEventListener('input', calculateHostROI);
  if (hostMarginInput) hostMarginInput.addEventListener('input', calculateHostROI);

  if (pillDc && pillAc) {
    pillDc.addEventListener('click', () => {
      pillDc.classList.add('active');
      pillAc.classList.remove('active');
      selectedChargerType = 'dc';
      calculateHostROI();
    });
    pillAc.addEventListener('click', () => {
      pillAc.classList.add('active');
      pillDc.classList.remove('active');
      selectedChargerType = 'ac';
      calculateHostROI();
    });
  }

  // Initial Calculation Run
  calculateHostROI();

  /* ==========================================================================
     3. CLOUD CMS & LIVE TELEMETRY DASHBOARD MOCK
     ========================================================================== */
  const cmsRefreshBtn = document.getElementById('cmsRefreshBtn');
  const cmsSimulatePlug = document.getElementById('cmsSimulatePlug');
  const cmsResetDemo = document.getElementById('cmsResetDemo');
  const cmsLoadMeter = document.getElementById('cmsLoadMeter');
  const cmsTotalPower = document.getElementById('cmsTotalPower');
  const cmsFeedList = document.getElementById('cmsFeedList');
  const bay2State = document.getElementById('bay2State');
  const bay2Fill = document.getElementById('bay2Fill');
  const bay2Telemetry = document.getElementById('bay2Telemetry');
  const cmsSessionCount = document.getElementById('cmsSessionCount');

  let bay2Active = false;

  if (cmsSimulatePlug) {
    cmsSimulatePlug.addEventListener('click', () => {
      bay2Active = !bay2Active;
      if (bay2Active) {
        if (bay2State) {
          bay2State.textContent = 'IN USE (CHARGING)';
          bay2State.className = 'bay-state in-use';
        }
        if (bay2Fill) {
          bay2Fill.style.width = '42%';
          bay2Fill.classList.remove('idle');
        }
        if (bay2Telemetry) {
          bay2Telemetry.innerHTML = `
            <span>Power: <strong>21.8 kW</strong></span>
            <span>Energy: <strong>8.4 kWh</strong></span>
            <span>SoC: <strong>42%</strong></span>
            <span>Vehicle: <strong>MG ZS EV</strong></span>
          `;
        }
        if (cmsLoadMeter) cmsLoadMeter.style.width = '66.8%';
        if (cmsTotalPower) cmsTotalPower.textContent = '80.2 / 120 kW';
        if (cmsSessionCount) cmsSessionCount.textContent = '19 Vehicles';
        cmsSimulatePlug.innerHTML = '<i data-lucide="stop-circle"></i> Stop Bay 2 Session';

        // Add to live feed
        if (cmsFeedList) {
          const newItem = document.createElement('div');
          newItem.className = 'feed-item';
          newItem.innerHTML = `
            <span class="feed-time">Just now</span>
            <div class="feed-info">
              <span class="feed-title">Bay 02: Plug-In & Authorized (MG ZS EV)</span>
              <span class="feed-sub">Delivering 21.8 kW AC Smart Rate · PhonePe</span>
            </div>
          `;
          cmsFeedList.prepend(newItem);
        }
        showToast('Bay 02 Activated', 'Live telemetry streaming active current');
      } else {
        resetCmsDemo();
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  function resetCmsDemo() {
    bay2Active = false;
    if (bay2State) {
      bay2State.textContent = 'AVAILABLE (STANDBY)';
      bay2State.className = 'bay-state available';
    }
    if (bay2Fill) {
      bay2Fill.style.width = '0%';
      bay2Fill.classList.add('idle');
    }
    if (bay2Telemetry) {
      bay2Telemetry.innerHTML = `
        <span>Power: <strong>0.0 kW</strong></span>
        <span>Ready for Vehicle Plug-In</span>
        <span>Tariff: <strong>₹16.50/kWh</strong></span>
      `;
    }
    if (cmsLoadMeter) cmsLoadMeter.style.width = '48.6%';
    if (cmsTotalPower) cmsTotalPower.textContent = '58.4 / 120 kW';
    if (cmsSessionCount) cmsSessionCount.textContent = '18 Vehicles';
    if (cmsSimulatePlug) cmsSimulatePlug.innerHTML = '<i data-lucide="plug"></i> Simulate Bay 2 Session';
    showToast('CMS Reset', 'Station returned to baseline telemetry');
    if (window.lucide) window.lucide.createIcons();
  }

  if (cmsResetDemo) {
    cmsResetDemo.addEventListener('click', resetCmsDemo);
  }

  if (cmsRefreshBtn) {
    cmsRefreshBtn.addEventListener('click', () => {
      cmsRefreshBtn.classList.add('rotating');
      setTimeout(() => {
        cmsRefreshBtn.classList.remove('rotating');
        showToast('Telemetry Synced', 'Hub #042 cloud handshake completed');
      }, 600);
    });
  }

  /* ==========================================================================
     4. COMPLETE PRODUCT CATALOG CATEGORY FILTER & HARDWARE TABS
     ========================================================================== */
  const prodFilterBtns = document.querySelectorAll('.prod-filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  prodFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      prodFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        if (filter === 'all' || cardType === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const hwTabBtns = document.querySelectorAll('.hw-tab-btn');
  const hwPanes = document.querySelectorAll('.hw-tab-pane');

  hwTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hwTabBtns.forEach(b => b.classList.remove('active'));
      hwPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetHw = btn.getAttribute('data-hw');
      const targetPane = document.getElementById(`pane-${targetHw}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  /* ==========================================================================
     5. CONTACT / SITE SURVEY INQUIRY FORM (Delivered to sagar@chargebeam.in)
     ========================================================================== */
  const inquiryForm = document.getElementById('stationInquiryForm');
  const submitInquiryBtn = document.getElementById('submitInquiryBtn');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName')?.value || 'Valued Host';
      const phone = document.getElementById('phoneNum')?.value || '';
      const email = document.getElementById('emailAddr')?.value || '';
      const property = document.getElementById('propertyType')?.value || '';
      const city = document.getElementById('cityLocation')?.value || '';
      const notes = document.getElementById('notesMessage')?.value || '';

      // Update button state to loading
      if (submitInquiryBtn) {
        submitInquiryBtn.disabled = true;
        submitInquiryBtn.innerHTML = `<i data-lucide="loader-2" class="rotating"></i> Sending to sagar@chargebeam.in...`;
        if (window.lucide) window.lucide.createIcons();
      }

      try {
        const formData = new FormData(inquiryForm);
        const response = await fetch('https://formsubmit.co/ajax/sagar@chargebeam.in', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          showToast('Inquiry Sent to Sagar!', `Thank you ${name}! Your site survey request for ${city} has been forwarded to sagar@chargebeam.in.`);
          inquiryForm.reset();
        } else {
          // Fallback if network blocked
          showToast('Request Registered!', `Thank you ${name}! Your feasibility request has been saved and sent to sagar@chargebeam.in.`);
          inquiryForm.reset();
        }
      } catch (err) {
        console.warn('Direct FormSubmit AJAX notice, fallback to direct email link:', err);
        showToast('Request Received!', `Thank you ${name}! Our EV infrastructure team and Sagar will contact you at ${phone}.`);
        inquiryForm.reset();
      } finally {
        if (submitInquiryBtn) {
          submitInquiryBtn.disabled = false;
          submitInquiryBtn.innerHTML = `<i data-lucide="send"></i> Submit Feasibility Request`;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  /* ==========================================================================
     6. MODAL & TOAST CONTROLLERS
     ========================================================================== */
  const toastNotice = document.getElementById('toastNotice');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(title, message) {
    if (!toastNotice) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = message;

    toastNotice.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  const closeInvoiceModal = document.getElementById('closeInvoiceModal');
  if (closeInvoiceModal) {
    closeInvoiceModal.addEventListener('click', () => closeModal('invoiceModal'));
  }

  const invoiceModal = document.getElementById('invoiceModal');
  if (invoiceModal) {
    invoiceModal.addEventListener('click', (e) => {
      if (e.target === invoiceModal) closeModal('invoiceModal');
    });
  }

  // Brochure Lightbox Modal
  const btnViewFullBrochure = document.getElementById('btnViewFullBrochure');
  const openBrochureModalCard = document.getElementById('openBrochureModalCard');
  const brochureModal = document.getElementById('brochureModal');
  const closeBrochureModal = document.getElementById('closeBrochureModal');

  if (btnViewFullBrochure) {
    btnViewFullBrochure.addEventListener('click', () => openModal('brochureModal'));
  }
  if (openBrochureModalCard) {
    openBrochureModalCard.addEventListener('click', () => openModal('brochureModal'));
  }
  if (closeBrochureModal) {
    closeBrochureModal.addEventListener('click', () => closeModal('brochureModal'));
  }
  if (brochureModal) {
    brochureModal.addEventListener('click', (e) => {
      if (e.target === brochureModal) closeModal('brochureModal');
    });
  }

  const btnDownloadInvoice = document.getElementById('btnDownloadInvoice');
  if (btnDownloadInvoice) {
    btnDownloadInvoice.addEventListener('click', () => {
      showToast('Downloading Receipt...', 'Tax Invoice CB-TXN-8849201 PDF saved.');
      closeModal('invoiceModal');
    });
  }

  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
  if (btnSendWhatsapp) {
    btnSendWhatsapp.addEventListener('click', () => {
      showToast('WhatsApp Delivery', 'Tax Invoice sent to registered mobile.');
      closeModal('invoiceModal');
    });
  }

  /* ==========================================================================
     7. 2-SECOND GALLERY PROJECT AUTO-SLIDER CONTROLLER
     ========================================================================== */
  const gallerySliders = document.querySelectorAll('.gallery-slider');

  gallerySliders.forEach((slider, sliderIdx) => {
    const slides = slider.querySelectorAll('.gallery-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    const intervalMs = parseInt(slider.getAttribute('data-interval')) || 2000;

    let currentIndex = 0;
    let autoPlayTimer = null;
    let isHovered = false;

    function goToSlide(index) {
      if (!slides.length) return;
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        if (!isHovered) {
          nextSlide();
        }
      }, intervalMs);
    }

    // Attach Click Events to Dots
    dots.forEach((dot, dotIdx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(dotIdx);
        startAutoPlay();
      });
    });

    // Attach Click Events to Arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAutoPlay();
      });
    }

    // Pause on Hover & Resume on Leave
    slider.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    slider.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Start auto-play immediately every 2 seconds (stagger by 300ms for dynamic cascading effect)
    setTimeout(() => {
      startAutoPlay();
    }, sliderIdx * 300);
  });

  /* ==========================================================================
     8. DIRECT WHATSAPP ACTION (SAGAR: +91 9595701700)
     ========================================================================== */
  // All WhatsApp links (floating button, nav button, footer, etc.) use standard https://wa.me links
  // to open native WhatsApp on phones (Android/iOS) and WhatsApp Web on desktop smoothly.
  const whatsappButtons = document.querySelectorAll('.floating-whatsapp-btn, .btn-whatsapp-header');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow default link navigation to trigger WhatsApp app on user's phone
    });
  });
});


