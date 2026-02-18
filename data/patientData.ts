// Embedding mock data directly to avoid JSON import issues in this environment
const mockData = [
  {
    "personal_profile": {
      "hn": "64001234",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Somchai",
      "full_name_th": "เด็กชายสมชาย ใจดี",
      "full_name_en": "Somchai Jaidee",
      "id_card": "1100100200301",
      "passport_no": null,
      "generated_code": null,
      "dob": "2023-11-15",
      "gender": "ชาย",
      "race": "ไทย",
      "nationality": "ไทย",
      "religion": "พุทธ",
      "marital_status": "โสด",
      "occupation": "นักเรียน",
      "blood_group": "B",
      "allergies": "ไม่มี",
      "email": "somchai.j@gmail.com",
      "address": {
        "house_no": "123/4",
        "moo": "5",
        "soi": "สุขสวัสดิ์ 3",
        "road": "เชียงใหม่-ฝาง",
        "sub_district": "ริมใต้",
        "district": "แม่ริม",
        "province": "เชียงใหม่",
        "zipcode": "50180"
      },
      "gps_location": {
        "lat": 18.9142,
        "lng": 98.9431
      },
      "phone": "081-234-5678",
      "home_phone": "053-111-222",
      "guardian": {
        "name": "นายสมบูรณ์ ใจดี",
        "relationship": "บิดา",
        "phone": "081-234-5678",
        "occupation": "รับจ้างทั่วไป",
        "status": "Living",
        "id_card": "3509900123456",
        "dob": "1980-05-15",
        "age": "45 ปี"
      },
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลฝาง",
      "treating_hospitals": [
        "รพ.มหาราชนครเชียงใหม่",
        "รพ.สันทราย"
      ],
      "pcu_affiliation": "รพ.สต.ริมใต้",
      "insurance_type": "บัตรทอง (UC)",
      "sub_insurance_type": "ผู้พิการ",
      "distance_km": 15.5,
      "travel_time_mins": 30,
      "first_treatment_date": "2023-12-01"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip and Palate",
      "diagnosing_doctor": "นพ.วิชัย เกียรติเกรียงไกร",
      "treatment_plan": [
        {
          "task": "ผ่าตัดเย็บปากแหว่ง (Cheiloplasty)",
          "appropriate_age": "3 เดือน",
          "status": "Completed",
          "appointment_id": "APP-001",
          "secondary_bookings": [
              { "date": "10 ม.ค. 67", "title": "ติดตามอาการทั่วไป" },
              { "date": "15 ม.ค. 67", "title": "นัดประเมินพัฒนาการ" }
          ]
        },
        {
          "task": "ผ่าตัดเย็บเพดานโหว่ (Palatoplasty)",
          "appropriate_age": "9-18 เดือน",
          "status": "Completed",
          "appointment_id": "APP-005"
        },
        {
          "task": "ฝึกพูด (Speech Therapy)",
          "appropriate_age": "2 ปี",
          "status": "Completed",
          "appointment_id": "APP-007"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-001",
        "date_time": "2024-02-15T09:00:00",
        "location": "โรงพยาบาลฝาง, ตึกศัลยกรรมชั้น 3",
        "doctor_name": "นพ.วิชัย เกียรติเกรียงไกร",
        "type": "ผ่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ1"
      },
      {
        "appointment_id": "APP-005",
        "date_time": "2024-06-15T09:00:00",
        "location": "โรงพยาบาลฝาง, ตึกศัลยกรรมชั้น 3",
        "doctor_name": "นพ.สมศักดิ์ รักงาน",
        "type": "ผ่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ1"
      },
      {
        "appointment_id": "APP-006",
        "date_time": "2025-12-04T09:00:00",
        "location": "โรงพยาบาลฝาง, อาคารผู้ป่วยนอก",
        "doctor_name": "นพ.วิชัย เกียรติเกรียงไกร",
        "type": "ติดตามอาการ",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ1"
      },
      {
        "appointment_id": "APP-007",
        "date_time": "2025-11-15T10:00:00",
        "location": "โรงพยาบาลฝาง, คลินิกฝึกพูด",
        "doctor_name": "นักแก้ไขการพูด สมศรี",
        "type": "ฝึกพูด",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ1"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "กองทุนมูลนิธิตะวันยิ้ม",
          "amount": 15000,
          "date_received": "2025-12-02",
          "status": "Approved",
          "approved_date": "2025-12-04T10:00:00",
          "request_reason": "ครอบครัวมีรายได้น้อย บิดาทำงานรับจ้างทั่วไปรายวัน ไม่เพียงพอต่อค่าใช้จ่ายในการเดินทางและค่าเวชภัณฑ์ส่วนเกิน"
        },
        {
          "source_name": "กองทุนช่วยเหลือฉุกเฉิน",
          "amount": 5000,
          "date_received": "2025-12-03",
          "status": "Pending",
          "request_reason": "ค่าใช้จ่ายฉุกเฉินในการเดินทางไปรักษาตัวที่โรงพยาบาลศูนย์"
        },
        {
            "source_name": "กองทุนพัฒนาคุณภาพชีวิต",
            "amount": 10000,
            "date_received": "2025-12-02",
            "status": "Rejected",
            "rejected_date": "2025-12-04T14:30:00",
            "request_reason": "ขอสนับสนุนค่าใช้จ่าในการซ่อมแซมที่อยู่อาศัย (ไม่อยู่ในเงื่อนไขกองทุน)"
        }
      ],
      "expenditure_records": [
        {
          "grant_source": "กองทุนมูลนิธิตะวันยิ้ม",
          "amount": 5000,
          "date": "2024-02-01",
          "reason": "ค่าอุปกรณ์ช่วยเพดานเทียม",
          "evidence_url": "receipt_001.jpg",
          "status": "Approved"
        },
        {
          "grant_source": "กองทุนมูลนิธิตะวันยิ้ม",
          "amount": 1500,
          "date": "2026-02-02",
          "reason": "ค่าเวชภัณฑ์ทำแผล",
          "evidence_url": "receipt_002.jpg",
          "status": "Pending"
        }
      ],
      "travel_reimbursement": [
        {
          "date": "2024-01-15",
          "amount": 300,
          "route": "แม่ริม - รพ.มหาราช"
        }
      ]
    },
    "referral_homevisit": {
      "referral_history": [
        {
          "from": "รพ.สต.ริมใต้",
          "to": "รพ.มหาราชนครเชียงใหม่",
          "date": "2023-12-01",
          "reason": "ส่งตัวรักษาเฉพาะทางครั้งแรก",
          "doctor": "นพ.วิชัย เกียรติเกรียงไกร",
          "status": "ตอบรับแล้ว",
          "acceptedDate": "2025-12-04T09:00:00"
        }
      ],
      "home_visit_history": [
        {
          "date": "2024-03-07",
          "requestDate": "2024-03-07",
          "visitor": "รพ.สต.ริมใต้",
          "visit_type": "Delegated",
          "status": "ไม่อนุญาต",
          "results": "ผู้ป่วยไม่อนุญาตให้เยี่ยม",
          "photos": ["visit_pic_01.png"],
          "data": {
              "patientName": "ด.ช. รักษา ดีจริง",
              "dob": "2023-01-10",
              "age": "2",
              "idCard": "1509900123456",
              "address": "123 หมู่ 1 ต.ริมใต้ อ.แม่ริม จ.เชียงใหม่",
              "phone": "081-234-5678",
              "diagnosis": ["Cleft Lip", "Cleft Palate"],
              "lipSurgeryStatus": "done",
              "palateSurgeryStatus": "waiting",
              "speechStatus": "yes",
              "hearingStatus": "no",
              "travelProblemStatus": "no"
          }
        },
        {
          "date": "2025-12-01",
          "requestDate": "2025-12-01",
          "visitor": "รพ.สต.ริมใต้",
          "visit_type": "Delegated",
          "status": "เสร็จสิ้น",
          "results": "เยี่ยมติดตามอาการประจำเดือน",
          "photos": [],
          "data": {}
        },
        {
          "date": "2025-12-10",
          "requestDate": "2025-12-03",
          "visitor": "รพ.สต.ริมใต้",
          "visit_type": "Delegated",
          "status": "รอเยี่ยม",
          "results": "นัดเยี่ยมติดตามหลังผ่าตัด",
          "photos": [],
          "data": {}
        }
      ]
    },
    "communication": {
      "team_care_chat": [
        {
          "sender": "นพ.วิชัย",
          "message": "คนไข้รายนี้เตรียมผ่าตัดรอบสองเดือนหน้าครับ",
          "timestamp": "2024-05-01T10:00:00"
        }
      ],
      "patient_chat": [
        {
          "sender": "พยาบาลสมศรี",
          "message": "คุณพ่ออย่าลืมงดน้ำงดอาหารน้องก่อนวันนัดนะคะ",
          "timestamp": "2024-06-01T08:30:00"
        }
      ]
    },
    "tele_consultation": [
      {
        "date_time": "2025-12-04T14:00:00",
        "request_date": "2025-12-03",
        "meeting_link": "https://zoom.us/j/123456789",
        "status": "เสร็จสิ้น",
        "channel": "hospital",
        "agency_name": "โรงพยาบาลฝาง",
        "doctor": "นพ.วิชัย เกียรติเกรียงไกร",
        "treatmentDetails": "ติดตามอาการหลังผ่าตัดเย็บปากแหว่ง ประเมินแผลผ่าตัดและการให้นม"
      }
    ]
  },
  {
    "personal_profile": {
      "hn": "67005678",
      "profile_picture": null,
      "full_name_th": "เด็กหญิงมานี มีนา",
      "full_name_en": "Manee Meena",
      "id_card": "0505001020301",
      "passport_no": null,
      "generated_code": "TC-670001",
      "dob": "2022-05-20",
      "gender": "หญิง",
      "nationality": "ไม่มีสถานะทางทะเบียน",
      "religion": "คริสต์",
      "email": null,
      "address": {
        "house_no": "99",
        "moo": "1",
        "soi": "-",
        "road": "ปาย-แม่ฮ่องสอน",
        "sub_district": "เวียงเหนือ",
        "district": "ปาย",
        "province": "แม่ฮ่องสอน",
        "zipcode": "58130"
      },
      "gps_location": {
        "lat": 19.3582,
        "lng": 98.4404
      },
      "phone": "092-888-9999",
      "guardian": {
        "name": "นางอาหมี่ มีนา",
        "relationship": "มารดา",
        "phone": "092-888-9999"
      },
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลฝาง",
      "treating_hospitals": ["รพ.นครพิงค์", "รพ.ปาย"],
      "pcu_affiliation": "รพ.สต.แม่งอน",
      "insurance_type": "ผู้มีปัญหาสถานะทางทะเบียน"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Palate",
      "diagnosing_doctor": "พญ.อรุณี รักดี",
      "treatment_plan": [
        {
          "task": "ผ่าตัดเย็บเพดานโหว่",
          "appropriate_age": "9-18 เดือน",
          "status": "Overdue/Delayed",
          "appointment_id": "APP-010"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-010",
        "date_time": "2024-02-10T10:30:00",
        "location": "โรงพยาบาลฝาง",
        "doctor_name": "พญ.อรุณี รักดี",
        "type": "ผ่าตัด",
        "status": "ขาดนัด",
        "room": "ห้องตรวจ 1"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "ทุนสภากาชาดไทย",
          "amount": 20000,
          "date_received": "2025-12-03",
          "status": "Approved",
          "approved_date": "2025-12-04T09:00:00"
        },
        {
          "source_name": "กองทุนเพื่อผู้ยากไร้",
          "amount": 5000,
          "date_received": "2025-12-02",
          "status": "Pending"
        }
      ],
      "expenditure_records": [],
      "travel_reimbursement": []
    },
    "referral_homevisit": {
      "referral_history": [],
      "home_visit_history": [
        {
          "date": "2025-12-08",
          "requestDate": "2025-12-04",
          "visitor": "CM อาสาสมัคร",
          "visit_type": "Joint",
          "status": "รอเยี่ยม",
          "results": "ยืน���ันนัดหมายแล้ว รอลงพื้นที่",
          "photos": []
        }
      ]
    },
    "communication": {
      "team_care_chat": [
        {
          "sender": "CM แดง",
          "message": "คนไข้ขาดนัดผ่าตัด ต้องตามตัวด่วนครับ",
          "timestamp": "2024-02-11T09:00:00"
        }
      ],
      "patient_chat": []
    },
    "tele_consultation": [
        {
        "date_time": "2025-12-05T10:00:00",
        "request_date": "2025-12-04",
        "meeting_link": "https://meet.google.com/abc-defg-hij",
        "status": "รอดำเนินการ",
        "channel": "agency",
        "agency_name": "รพ.สต.แม่งอน",
        "doctor": "พญ.อรุณี รักดี",
        "treatmentDetails": "ให้คำปรึกษาเรื่องแผนผ่าตัดเพดานโหว่และเตรียมตัวก่อนผ่าตัด"
      }
    ]
  },
  {
    "personal_profile": {
      "hn": "65009876",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      "full_name_th": "นาย จอห์น สมิธ",
      "full_name_en": "John Smith",
      "id_card": "9999988888776",
      "passport_no": "AA55667788",
      "generated_code": null,
      "dob": "1995-08-12",
      "gender": "ชาย",
      "nationality": "อเมริกัน",
      "religion": "คริสต์",
      "email": "john.smith@expat.com",
      "address": {
        "house_no": "500",
        "moo": "-",
        "soi": "เจริญราษฎร์ 7",
        "road": "ช้างคลาน",
        "sub_district": "ช้างคลาน",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่",
        "zipcode": "50100"
      },
      "gps_location": {
        "lat": 18.7815,
        "lng": 98.995
      },
      "phone": "085-000-1111",
      "guardian": null,
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลฝาง",
      "treating_hospitals": ["รพ.เชียงใหม่ราม"],
      "pcu_affiliation": "รพ.สต.ริมใต้",
      "insurance_type": "ประกันชีวิตส่วนบุคคล"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip",
      "diagnosing_doctor": "นพ.ธีระพล สุดหล่อ",
      "treatment_plan": [
        {
          "task": "ตกแต่งแผลเป็นหลังผ่าตัด",
          "appropriate_age": "25 ปีขึ้นไป",
          "status": "Completed",
          "appointment_id": "APP-99"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-99",
        "date_time": "2024-01-20T13:00:00",
        "location": "โรงพยาบาลฝาง, แผนกความงาม",
        "doctor_name": "นพ.ธีระพล สุดหล่อ",
        "type": "ตรวจรักษา",
        "status": "มาตามนัด",
        "room": "ห้องตรวจ 2"
      }
    ],
    "finance": {
      "received_grants": [],
      "expenditure_records": [],
      "travel_reimbursement": []
    },
    "referral_homevisit": {
      "referral_history": [
        {
          "from": "รพ.เอกชน",
          "to": "รพ.มหาราช",
          "date": "2025-12-04",
          "reason": "Refer In for specialized surgery",
          "status": "Pending"
        }
      ],
      "home_visit_history": []
    },
    "communication": {
      "team_care_chat": [],
      "patient_chat": [
        {
          "sender": "John Smith",
          "message": "Is the scar recovery normal?",
          "timestamp": "2024-01-21T10:00:00"
        }
      ]
    },
    "tele_consultation": []
  },
  {
    "personal_profile": {
      "hn": "60004321",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Mali",
      "full_name_th": "นางสาวมะลิ หอมนวล",
      "full_name_en": "Mali Homnuan",
      "id_card": "3500100455882",
      "passport_no": null,
      "generated_code": null,
      "dob": "2000-01-01",
      "gender": "หญิง",
      "nationality": "ไทย",
      "religion": "พุทธ",
      "email": "mali@mail.com",
      "address": {
        "house_no": "1",
        "moo": "2",
        "soi": "วัดป่าแดด",
        "road": "มหิดล",
        "sub_district": "ป่าแดด",
        "district": "เมือง",
        "province": "เชียงใหม่",
        "zipcode": "50100"
      },
      "gps_location": {
        "lat": 18.7523,
        "lng": 98.9812
      },
      "phone": "089-999-8888",
      "guardian": null,
      "patient_status": "Inactive",
      "patient_status_label": "รักษาเสร็จสิ้น"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลฝาง",
      "treating_hospitals": ["รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.ริมใต้",
      "insurance_type": "ประกันสังคม"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Palate",
      "diagnosing_doctor": "นพ.สมพร มากมาย",
      "treatment_plan": [
        {
          "task": "ฝึกพูดขั้นสูง",
          "appropriate_age": "18 ปี",
          "status": "Completed",
          "appointment_id": null
        }
      ]
    },
    "appointments": [],
    "finance": {
      "received_grants": [],
      "expenditure_records": [],
      "travel_reimbursement": []
    },
    "referral_homevisit": {
      "referral_history": [],
      "home_visit_history": [
        {
          "date": "2025-12-08",
          "requestDate": "2025-12-04",
          "visitor": "รพ.สต.ริมใต้",
          "visit_type": "Delegated",
          "status": "Pending",
          "results": "เยี่ยมติดตามอาการทั่วไป",
          "photos": []
        }
      ]
    },
    "communication": {
      "team_care_chat": [],
      "patient_chat": []
    },
    "tele_consultation": []
  },
  {
    "personal_profile": {
      "hn": "67001111",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anan",
      "full_name_th": "เด็กชายอนันต์ ทอดดี",
      "full_name_en": "Anan Yorddee",
      "id_card": "1209900123456",
      "passport_no": null,
      "generated_code": null,
      "dob": "2024-01-10",
      "gender": "ชาย",
      "nationality": "ไทย",
      "religion": "พุทธ",
      "email": null,
      "address": {
        "house_no": "45",
        "moo": "3",
        "soi": "มูลเมือง 2",
        "road": "มูลเมือง",
        "sub_district": "ศรีภูมิ",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่",
        "zipcode": "50200"
      },
      "gps_location": {
        "lat": 18.7902,
        "lng": 98.9844
      },
      "phone": "086-555-4444",
      "guardian": {
        "name": "นายยอด ยอดดี",
        "relationship": "บิดา",
        "phone": "086-555-4444"
      },
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลฝาง",
      "treating_hospitals": ["รพ.ฝาง", "รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.แม่งอน",
      "insurance_type": "บัตรทอง (UC)"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip",
      "diagnosing_doctor": "นพ.ประเสริฐ ดีเยี่ยม",
      "treatment_plan": [
        {
          "task": "ตรวจประเมินก่อนผ่าตัด",
          "appropriate_age": "1 เดือน",
          "status": "Completed",
          "appointment_id": "APP-202"
        },
        {
          "task": "ผ่าตัดเย็บปาก",
          "appropriate_age": "3 เดือน",
          "status": "Upcoming",
          "appointment_id": "APP-205"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-205",
        "date_time": "2026-02-12T10:00:00",
        "location": "โรงพยาบาลฝาง, ห้องผ่าตัด 1",
        "doctor_name": "นพ.ประเสริฐ ดีเยี่ยม",
        "type": "ผ่าตัด",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ2"
      },
      {
        "appointment_id": "APP-206",
        "date_time": "2026-02-13T10:30:00",
        "location": "โรงพยาบาลฝาง",
        "doctor_name": "นพ.ประเสริฐ ดีเยี่ยม",
        "type": "นัดหมายตรวจรักษา",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ2"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "ทุนอบจ.เชียงใหม่",
          "amount": 3000,
          "date_received": "2025-12-03",
          "status": "Approved",
          "approved_date": "2025-12-04T11:30:00"
        },
        {
          "source_name": "มูลนิธิขาเทียม",
          "amount": 10000,
          "date_received": "2025-12-02",
          "status": "Rejected",
          "rejected_date": "2025-12-04T16:00:00"
        }
      ],
      "expenditure_records": [],
      "travel_reimbursement": []
    },
    "referral_homevisit": {
      "referral_history": [],
      "home_visit_history": [
        {
          "date": "2025-12-01",
          "requestDate": "2025-12-01",
          "visitor": "พยาบาลประจำตำบล",
          "visit_type": "Joint",
          "status": "ไม่อยู่",
          "results": "ผู้ป่วยไม่อยู่บ้าน",
          "photos": ["feed_01.jpg"]
        },
        {
          "date": "2025-12-10",
          "requestDate": "2025-12-03",
          "visitor": "พยาบาลประจำตำบล",
          "visit_type": "Joint",
          "status": "รอเยี่ยม",
          "results": "นัดเยี่ยมติดตามพัฒนาการ",
          "photos": []
        }
      ]
    },
    "communication": {
      "team_care_chat": [],
      "patient_chat": []
    },
    "tele_consultation": [
      {
        "date_time": "2025-12-05T15:00:00",
        "request_date": "2025-12-03",
        "channel": "mobile",
        "meeting_link": "https://meet.google.com/xyz-uvwx-rst",
        "status": "รอดำเนินการ",
        "doctor": "นพ.ประเสริฐ ดีเยี่ยม",
        "treatmentDetails": "ให้คำปรึกษาผู้ปกครองเกี่ยวกับการดูแลก่อนผ่าตัดเย็บปากแหว่ง"
      }
    ]
  },
  {
    "personal_profile": {
      "hn": "68002222",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Suda",
      "full_name_th": "นางสาวสุดา รักดี",
      "full_name_en": "Suda Rakdee",
      "id_card": "1509900011223",
      "passport_no": null,
      "generated_code": null,
      "dob": "2015-05-05",
      "gender": "หญิง",
      "nationality": "ไทย",
      "religion": "พุทธ",
      "email": null,
      "address": {
        "house_no": "10/1",
        "moo": "4",
        "soi": "โชตนา 5",
        "road": "โชตนา",
        "sub_district": "ช้างเผือก",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่",
        "zipcode": "50300"
      },
      "gps_location": {
        "lat": 18.8064,
        "lng": 98.9745
      },
      "phone": "084-111-2222",
      "guardian": {
        "name": "นางนภา รักดี",
        "relationship": "มารดา",
        "phone": "084-111-2222"
      },
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลฝาง",
      "treating_hospitals": ["รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.ช้างเผือก",
      "insurance_type": "ข้าราชการ (เบิกตรง)"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip and Palate",
      "diagnosing_doctor": "นพ.เกรียงไกร เก่งกาจ",
      "treatment_plan": [
        {
          "task": "ผ่าตัดเย็บปากแหว่ง (Cheiloplasty)",
          "appropriate_age": "3 เดือน",
          "status": "Completed",
          "appointment_id": "APP-550",
          "secondary_bookings": [
            { "date": "10 ม.ค. 59", "title": "ติดตามอาการทั่วไป" },
            { "date": "15 ม.ค. 59", "title": "นัดประเมินพัฒนาการ" }
          ]
        },
        {
          "task": "ผ่าตัดเย็บเพดานโหว่ (Palatoplasty)",
          "appropriate_age": "9-18 เดือน",
          "status": "Completed",
          "appointment_id": "APP-551",
          "secondary_bookings": [
            { "date": "5 มี.ค. 60", "title": "ติดตามแผลหลังผ่าตัด" },
            { "date": "20 มี.ค. 60", "title": "ประเมินการกลืน/ดูดนม" }
          ]
        },
        {
          "task": "ตรวจประเมินการพูด (Speech Assessment)",
          "appropriate_age": "3-4 ปี",
          "status": "Completed",
          "appointment_id": "APP-552",
          "secondary_bookings": [
            { "date": "12 ก.พ. 62", "title": "ฝึกพูดครั้งที่ 1" },
            { "date": "26 ก.พ. 62", "title": "ฝึกพูดครั้งที่ 2" },
            { "date": "15 มี.ค. 62", "title": "ประเมินผลการฝึกพูด" }
          ]
        },
        {
          "task": "ผ่าตัดปลูกกระดูก (Bone Graft)",
          "appropriate_age": "8-12 ปี",
          "status": "Completed",
          "appointment_id": "APP-553",
          "secondary_bookings": [
            { "date": "5 ส.ค. 67", "title": "ตรวจ X-Ray ก่อนผ่าตัด" },
            { "date": "20 ส.ค. 67", "title": "ติดตามแผลหลังผ่าตัด" }
          ]
        },
        {
          "task": "จัดฟัน (Orthodontics)",
          "appropriate_age": "8-12 ปี",
          "status": "Upcoming",
          "appointment_id": "APP-555",
          "secondary_bookings": [
            { "date": "11 ก.พ. 69", "title": "ตรวจประเมินก่อนจัดฟัน" },
            { "date": "25 ก.พ. 69", "title": "นัดติดเครื่องมือจัดฟัน" }
          ]
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-550",
        "date_time": "2015-12-20T09:00:00",
        "location": "โรงพยาบาลฝาง, แผนกศัลยกรรม",
        "doctor_name": "นพ.เกรียงไกร เก่งกาจ",
        "type": "ผ่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องผ่าตัด 3"
      },
      {
        "appointment_id": "APP-551",
        "date_time": "2017-02-15T09:00:00",
        "location": "โรงพยาบาลฝาง, แผนกศัลยกรรม",
        "doctor_name": "นพ.เกรียงไกร เก่งกาจ",
        "type": "ผ่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องผ่าตัด 3"
      },
      {
        "appointment_id": "APP-552",
        "date_time": "2019-01-25T10:00:00",
        "location": "โรงพยาบาลฝาง, แผนกฝึกพูด",
        "doctor_name": "นพญ.กัลยา พูดดี",
        "type": "ตรวจประเมิน",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ 5"
      },
      {
        "appointment_id": "APP-553",
        "date_time": "2024-07-20T08:30:00",
        "location": "โรงพยาบาลฝาง, แผนกศัลยกรรม",
        "doctor_name": "นพ.เกรียงไกร เก่งกาจ",
        "type": "����่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องผ่าตัด 1"
      },
      {
        "appointment_id": "APP-555",
        "date_time": "2026-02-11T11:00:00",
        "location": "โรงพยาบาลฝาง, แผนกทันตกรรม",
        "doctor_name": "ทพญ.สมศรี มีฟัน",
        "type": "ติดตามอาการ",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ 2"
      }
    ],
    "finance": {
      "received_grants": [],
      "expenditure_records": [],
      "travel_reimbursement": []
    },
    "referral_homevisit": {
      "referral_history": [
        {
          "from": "รพ.สต.ช้างเผือก",
          "to": "รพ.มหาราชนครเชียงใหม่",
          "date": "2026-02-02",
          "reason": "ส่งตัวเพื่อจัดฟันต่อเนื่อง",
          "status": "Pending",
          "urgency": "Routine"
        }
      ],
      "home_visit_history": []
    },
    "communication": {
      "team_care_chat": [
        {
          "sender": "ทพญ.สมศรี",
          "message": "ฟันบนเริ่มซ้อน ต้องเตรียมเครื่องมือจัดฟันครับ",
          "timestamp": "2024-05-10T14:00:00"
        }
      ],
      "patient_chat": []
    },
    "tele_consultation": []
  },
  {
    "personal_profile": {
      "hn": "66003333",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ploy",
      "full_name_th": "เด็กหญิงพลอย วงศ์สุวรรณ",
      "full_name_en": "Ploy Wongsuwan",
      "id_card": "1501400789012",
      "passport_no": null,
      "generated_code": "TC-660001",
      "dob": "2024-06-20",
      "gender": "หญิง",
      "nationality": "ไทย",
      "religion": "พุทธ",
      "email": null,
      "address": {
        "house_no": "88/2",
        "moo": "6",
        "soi": "ศรีวิชัย 4",
        "road": "สุเทพ",
        "sub_district": "สุเทพ",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่",
        "zipcode": "50200"
      },
      "gps_location": {
        "lat": 18.7953,
        "lng": 98.9523
      },
      "phone": "063-456-7890",
      "guardian": {
        "name": "นางสมฤทัย วงศ์สุวรรณ",
        "relationship": "มารดา",
        "phone": "063-456-7890"
      },
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลมหาราชนครเชียงใหม่",
      "treating_hospitals": ["รพ.มหาราชนครเชียงใหม่", "รพ.ฝาง"],
      "pcu_affiliation": "รพ.สต.สุเทพ",
      "insurance_type": "บัตรทอง (UC)"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip and Palate",
      "diagnosing_doctor": "นพ.ธนพล จิตเมตตา",
      "treatment_plan": [
        {
          "task": "ตรวจประเมินก่อนผ่าตัด",
          "appropriate_age": "1 เดือน",
          "status": "Completed",
          "appointment_id": "APP-701"
        },
        {
          "task": "ผ่าตัดเย็บปากแหว่ง",
          "appropriate_age": "3-6 เดือน",
          "status": "Upcoming",
          "appointment_id": "APP-702"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-701",
        "date_time": "2025-11-20T09:00:00",
        "location": "โรงพยาบาลมหาราชนครเชียงใหม่, แผนกศัลยกรรมตกแต่ง",
        "doctor_name": "นพ.ธนพล จิตเมตตา",
        "type": "ตรวจประเมิน",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ 7"
      },
      {
        "appointment_id": "APP-702",
        "date_time": "2026-03-10T08:30:00",
        "location": "โรงพยาบาลมหาราชนครเชียงใหม่, ห้องผ่าตัด 2",
        "doctor_name": "นพ.ธนพล จิตเมตตา",
        "type": "ผ่าตัด",
        "status": "รอพบแพทย์",
        "room": "ห้องผ่าตัด 2"
      },
      {
        "appointment_id": "APP-703",
        "date_time": "2026-02-20T10:00:00",
        "location": "โรงพยาบาลมหาราชนครเชียงใหม่",
        "doctor_name": "พญ.นิภา ใจสะอาด",
        "type": "นัดหมายตรวจรักษา",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ 3"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "มูลนิธิสร้างรอยยิ้ม",
          "amount": 15000,
          "date_received": "2025-11-25",
          "status": "Approved",
          "approved_date": "2025-11-26T09:00:00"
        },
        {
          "source_name": "ทุนกองทุนหลักประกันสุขภาพ",
          "amount": 5000,
          "date_received": "2025-12-01",
          "status": "Pending"
        }
      ],
      "expenditure_records": [],
      "travel_reimbursement": [
        {
          "trip_date": "2025-11-20",
          "destination": "รพ.มหาราชนครเชียงใหม่",
          "amount": 800,
          "status": "Approved"
        }
      ]
    },
    "referral_homevisit": {
      "referral_history": [
        {
          "from": "รพ.สต.สุเทพ",
          "to": "รพ.มหาราชนครเชียงใหม่",
          "date": "2025-11-15",
          "reason": "ส่งตัวเพื่อตรวจประเมินปากแหว่งเพดานโหว่",
          "status": "Completed",
          "urgency": "Routine"
        },
        {
          "from": "รพ.มหาราชนครเชียงใหม่",
          "to": "รพ.ฝาง",
          "date": "2026-02-05",
          "reason": "ส่งตัวเพื่อเตรียมผ่าตัด ใกล้บ้านผู้ป่วย",
          "status": "Pending",
          "urgency": "Routine"
        }
      ],
      "home_visit_history": [
        {
          "date": "2025-12-05",
          "requestDate": "2025-12-01",
          "visitor": "รพ.สต.สุเทพ",
          "visit_type": "Self",
          "status": "เสร็จสิ้น",
          "results": "เยี่ยมประเมินพัฒนาการทารก สอนวิธีให้นมทางสายยาง",
          "photos": ["visit_ploy_01.jpg"]
        },
        {
          "date": "2026-01-15",
          "requestDate": "2026-01-10",
          "visitor": "พยาบาลประจำตำบล",
          "visit_type": "Joint",
          "status": "รอเยี่ยม",
          "results": "นัดเยี่ยมเตรียมก่อนผ่าตัด",
          "photos": []
        }
      ]
    },
    "communication": {
      "team_care_chat": [
        {
          "sender": "นพ.ธนพล",
          "message": "น้องพลอยน้ำหนักขึ้นดี พร้อมผ่าตัดได้ตามกำหนด",
          "timestamp": "2025-12-10T14:30:00"
        }
      ],
      "patient_chat": [
        {
          "sender": "นางสมฤทัย วงศ์สุวรรณ",
          "message": "ลูกดูดนมจากขวดได้ดีขึ้นค่ะ",
          "timestamp": "2025-12-08T09:15:00"
        }
      ]
    },
    "tele_consultation": [
      {
        "date_time": "2025-12-02T10:00:00",
        "request_date": "2025-11-28",
        "channel": "hospital",
        "meeting_link": "https://meet.google.com/mhr-ploy-001",
        "status": "เสร็จสิ้น",
        "agency_name": "โรงพยาบาลมหาราชนครเชียงใหม่",
        "doctor": "นพ.ธนพล จิตเมตตา",
        "treatmentDetails": "ติดตามพัฒนาการน้ำหนักและประเมินความพร้อมก่อนผ่าตัด"
      },
      {
        "date_time": "2026-01-10T14:00:00",
        "request_date": "2026-01-05",
        "channel": "mobile",
        "meeting_link": "https://meet.google.com/mhr-ploy-002",
        "status": "รอดำเนินการ",
        "doctor": "พญ.นิภา ใจสะอาด",
        "treatmentDetails": "ให้คำปรึกษามารดาเรื่องการดูแลก่อนผ่าตัด"
      }
    ]
  },
  {
    "personal_profile": {
      "hn": "67004444",
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kittipong",
      "full_name_th": "เด็กชายกิตติพงศ์ แซ่ลี",
      "full_name_en": "Kittipong Saelee",
      "id_card": "5501200345678",
      "passport_no": null,
      "generated_code": "TC-670002",
      "dob": "2022-09-15",
      "gender": "ชาย",
      "nationality": "ไทย",
      "religion": "พุทธ",
      "email": null,
      "address": {
        "house_no": "15",
        "moo": "9",
        "soi": "-",
        "road": "ลำปาง-เชียงใหม่",
        "sub_district": "ดอนแก้ว",
        "district": "แม่ริม",
        "province": "เชียงใหม่",
        "zipcode": "50180"
      },
      "gps_location": {
        "lat": 18.8912,
        "lng": 98.9234
      },
      "phone": "097-321-6543",
      "guardian": {
        "name": "นายธวัช แซ่ลี",
        "relationship": "บิดา",
        "phone": "097-321-6543"
      },
      "patient_status": "Active",
      "patient_status_label": "ปกติ"
    },
    "hospital_insurance": {
      "main_affiliation": "โรงพยาบาลนครพิงค์",
      "treating_hospitals": ["รพ.นครพิงค์", "รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.ดอนแก้ว",
      "insurance_type": "บัตรทอง (UC)"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Palate",
      "diagnosing_doctor": "นพ.วรเดช ศรีพิทักษ์",
      "treatment_plan": [
        {
          "task": "ดูแลก่อนผ่าตัด ติดตามน้ำหนัก",
          "appropriate_age": "6 เดือน",
          "status": "Completed",
          "appointment_id": "APP-801"
        },
        {
          "task": "ผ่าตัดเย็บเพดานโหว่",
          "appropriate_age": "9-18 เดือน",
          "status": "Overdue/Delayed",
          "appointment_id": "APP-802"
        },
        {
          "task": "ฝึกพูดระยะต้น",
          "appropriate_age": "2-3 ปี",
          "status": "Upcoming",
          "appointment_id": "APP-803"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-801",
        "date_time": "2025-10-05T09:30:00",
        "location": "โรงพยาบาลนครพิงค์, แผนกกุมารเวชกรรม",
        "doctor_name": "นพ.วรเดช ศรีพิทักษ์",
        "type": "ตรวจประเมิน",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ 4"
      },
      {
        "appointment_id": "APP-802",
        "date_time": "2026-02-18T08:00:00",
        "location": "โรงพยาบาลนครพิงค์, ห้องผ่าตัด 1",
        "doctor_name": "นพ.วรเดช ศรีพิทักษ์",
        "type": "ผ่าตัด",
        "status": "รอพบแพทย์",
        "room": "ห้องผ่าตัด 1"
      },
      {
        "appointment_id": "APP-803",
        "date_time": "2026-04-25T10:00:00",
        "location": "โรงพยาบาลนครพิงค์, แผนกฝึกพูด",
        "doctor_name": "นพญ.กัลยา พูดดี",
        "type": "ติดตามอาการ",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ 6"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "ทุนอบจ.เชียงใหม่",
          "amount": 8000,
          "date_received": "2025-10-10",
          "status": "Approved",
          "approved_date": "2025-10-12T10:00:00"
        },
        {
          "source_name": "มูลนิธิขาเทียม",
          "amount": 12000,
          "date_received": "2025-11-20",
          "status": "Approved",
          "approved_date": "2025-11-22T14:30:00"
        },
        {
          "source_name": "กองทุนช่วยเหลือเด็กพิการ",
          "amount": 5000,
          "date_received": "2025-12-05",
          "status": "Pending"
        }
      ],
      "expenditure_records": [],
      "travel_reimbursement": [
        {
          "trip_date": "2025-10-05",
          "destination": "รพ.นครพิงค์",
          "amount": 500,
          "status": "Approved"
        },
        {
          "trip_date": "2026-02-18",
          "destination": "รพ.นครพิงค์",
          "amount": 500,
          "status": "Pending"
        }
      ]
    },
    "referral_homevisit": {
      "referral_history": [
        {
          "from": "รพ.สต.ดอนแก้ว",
          "to": "รพ.นครพิงค์",
          "date": "2025-09-20",
          "reason": "ส่งตัวตรวจเพดานโหว่ครั้งแรก",
          "status": "Completed",
          "urgency": "Urgent"
        },
        {
          "from": "รพ.นครพิงค์",
          "to": "รพ.มหาราชนครเชียงใหม่",
          "date": "2026-01-15",
          "reason": "ส่งตัวปรึกษาศัลยกรรมเพดานโหว่ซับซ้อน",
          "status": "Pending",
          "urgency": "Routine"
        }
      ],
      "home_visit_history": [
        {
          "date": "2025-11-01",
          "requestDate": "2025-10-25",
          "visitor": "รพ.สต.ดอนแก้ว",
          "visit_type": "Self",
          "status": "เสร็จสิ้น",
          "results": "ประเมินพัฒนาการ ทารกดูดนมได้ปกติ น้ำหนักขึ้นดี",
          "photos": ["visit_kitt_01.jpg"]
        },
        {
          "date": "2025-12-15",
          "requestDate": "2025-12-10",
          "visitor": "พยาบาลประจำตำบล",
          "visit_type": "Joint",
          "status": "เสร็จสิ้น",
          "results": "ติดตามน้ำหนัก ให้คำแนะนำมารดาเรื่องโภชนาการ",
          "photos": ["visit_kitt_02.jpg"]
        },
        {
          "date": "2026-02-10",
          "requestDate": "2026-02-01",
          "visitor": "รพ.สต.ดอนแก้ว",
          "visit_type": "Delegated",
          "status": "รอเยี่ยม",
          "results": "นัดเยี่ยมเตรียมก่อนผ่าตัดเพดานโหว่",
          "photos": []
        }
      ]
    },
    "communication": {
      "team_care_chat": [
        {
          "sender": "นพ.วรเดช",
          "message": "น้องกิตติพงศ์ น้ำหนัก 10.5 กก. พร้อมผ่าตัดได้",
          "timestamp": "2026-01-20T11:00:00"
        },
        {
          "sender": "พย.อัมพร",
          "message": "นัดเยี่ยมบ้านก่อนผ่าตัด 10 ก.พ. ค่ะ",
          "timestamp": "2026-01-22T09:30:00"
        }
      ],
      "patient_chat": [
        {
          "sender": "นายธวัช แซ่ลี",
          "message": "ลูกกินนมได้ดีครับ แต่น้ำมูกออกทางจมูกบ่อย",
          "timestamp": "2026-01-18T15:00:00"
        }
      ]
    },
    "tele_consultation": [
      {
        "date_time": "2025-10-20T09:30:00",
        "request_date": "2025-10-15",
        "channel": "agency",
        "meeting_link": "https://meet.google.com/nkp-kitt-001",
        "status": "เสร็จสิ้น",
        "agency_name": "รพ.สต.ดอนแก้ว",
        "doctor": "นพ.วรเดช ศรีพิทักษ์",
        "treatmentDetails": "ปรึกษาเรื่องแผนการผ่าตัดเย็บเพดานโหว่และเตรียมตัว"
      },
      {
        "date_time": "2025-12-18T14:00:00",
        "request_date": "2025-12-12",
        "channel": "mobile",
        "meeting_link": "https://meet.google.com/nkp-kitt-002",
        "status": "เสร็จสิ้น",
        "doctor": "นพ.วรเดช ศรีพิทักษ์",
        "treatmentDetails": "ติดตามอาการหลังฝึกให้นม สอบถามปัญหาน้ำนมไหลทางจมูก"
      },
      {
        "date_time": "2026-02-15T10:00:00",
        "request_date": "2026-02-10",
        "channel": "hospital",
        "meeting_link": "https://meet.google.com/nkp-kitt-003",
        "status": "รอดำเนินการ",
        "agency_name": "โรงพยาบาลนครพิงค์",
        "doctor": "นพ.วรเดช ศรีพิทักษ์",
        "treatmentDetails": "ปรึกษาก่อนผ่าตัดเพดานโหว่ เตรียมตัวสุดท้าย"
      }
    ]
  }
];

export interface Patient {
    id: string;
    hn: string;
    cid: string;
    name: string;
    age: string;
    dob: string;
    gender?: string;
    diagnosis: string;
    status: string;
    hospital: string;
    responsibleHealthCenter?: string;
    contact: {
        name: string;
        phone: string;
        homePhone?: string;
        address: string;
        zipcode?: string;
        relation?: string;
        // New fields
        idCard?: string;
        dob?: string;
        age?: string;
        occupation?: string;
        status?: string;
    };
    rights: string;
    nextAppointment: string | null;
    image: string;
    timeline: Array<{
        age: string;
        stage: string;
        status: string;
        date: string;
        estimatedDate?: string;
        secondaryBookings?: Array<{ date: string; title: string }>;
    }>;
    history: Array<{
        id: number;
        date: string;
        title: string;
        detail: string;
        doctor: string;
        department: string;
        time?: string;
        nextAppt?: string;
        status?: string;
        note?: string;
        // New fields
        hospital?: string;
        treatment?: string;
        chiefComplaint?: string;
        presentIllness?: string;
        pastHistory?: string;
        diagnosis?: string;
        treatmentResult?: string;
        treatmentPlan?: string;
    }>;
    funding: Array<{
        type: string;
        status: string;
        amount: string;
    }>;
    funds: Array<{
        name: string;
        amount: number;
        historyTitle: string;
        history: Array<any>;
    }>;
    diagnosisTags?: string[];
    doctor?: string;
    gpsLocation?: { lat: number; lng: number };
    // Personal Info Extended
    race?: string;
    nationality?: string;
    religion?: string;
    maritalStatus?: string;
    occupation?: string;
    bloodGroup?: string;
    allergies?: string;
    email?: string;
    // Address breakdown
    addressNo?: string;
    addressMoo?: string;
    addressSoi?: string;
    addressRoad?: string;
    addressPostalCode?: string;
    addressProvince?: string;
    addressDistrict?: string;
    addressSubDistrict?: string;
    // Hospital Info Extended
    hospitalInfo?: {
        // distance?: number;
        // travelTime?: number;
        firstDate?: string;
        responsibleRph?: string;
    };
    // Additional fields for other modules
    type?: string;
    date?: string; // For calendar view consistency
    time?: string;
    urgency?: string;
    channel?: string;
    detail?: string;
    room?: string;
    // Referral specific
    referralNo?: string;
    destinationHospital?: string;
    referralDate?: string;
    reason?: string;
    documents?: string[];
    logs?: any[];
    // Home Visit specific
    rph?: string;
    requestDate?: string;
    note?: string;
    // Telemed specific
    caseManager?: string;
    pcu?: string;
    zoomUser?: string;
    treatmentDetails?: string;
    meetingLink?: string;
    // Extra fields for filters
    medicalCondition?: string;
    province?: string;
    apptStatus?: string; // Status of the dashboard/main appointment
    // History Arrays for PatientHistoryTab
    visitHistory?: any[];
    appointmentHistory?: any[];
    appointments?: any[]; // Appointments for PatientDetailView (merged from raw appointments + treatment secondary bookings)
    referralHistory?: any[];
    teleConsultHistory?: any[];
    // Patient clinical status (สถานะผู้ป่วย) — separate from case status (Active/Inactive)
    patientStatusLabel?: string;
}

// Helper to calculate age from DOB
const calculateAge = (dob: string) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date('2025-12-04'); // Updated Demo Date
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age === 0) {
         let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
         return `${months} เดือน`;
    }
    return `${age} ปี`;
};

// Helper: parse appropriate_age string like "3 เดือน", "9-18 เดือน", "2 ปี", "8-12 ปี" to months
const parseAppropriateAgeToMonths = (ageStr: string): number => {
    if (!ageStr) return 0;
    // Take the first number in a range (e.g. "9-18 เดือน" → 9)
    const yearMatch = ageStr.match(/(\d+)\s*ปี/);
    const monthMatch = ageStr.match(/(\d+)\s*เดือน/);
    let months = 0;
    if (yearMatch) months += parseInt(yearMatch[1]) * 12;
    if (monthMatch) months += parseInt(monthMatch[1]);
    // If neither matched, try a raw number
    if (!yearMatch && !monthMatch) {
        const numMatch = ageStr.match(/(\d+)/);
        if (numMatch) months = parseInt(numMatch[1]);
    }
    return months;
};

// Helper: compute estimated date from DOB + age offset (in months)
const computeEstimatedDate = (dob: string, appropriateAge: string): string => {
    if (!dob || !appropriateAge) return '';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '';
    const months = parseAppropriateAgeToMonths(appropriateAge);
    if (months === 0) return '';
    const targetDate = new Date(birthDate);
    targetDate.setMonth(targetDate.getMonth() + months);
    // Format as Thai date: "15 ก.พ. 67"
    return targetDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

// Helper: format date to Thai short format consistently (e.g., "4 ธ.ค. 68")
const THAI_MONTHS_SHORT_DATA = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const formatThaiDateShortData = (dateStr: string): string => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = THAI_MONTHS_SHORT_DATA[d.getMonth()];
    const year = (d.getFullYear() + 543) % 100;
    return `${day} ${month} ${year}`;
};

// Transform JSON to PATIENTS_DATA
export const PATIENTS_DATA: Patient[] = mockData.map((data: any, index: number) => {
    const profile = data.personal_profile;
    const insurance = data.hospital_insurance;
    const diagnosis = data.diagnosis_treatment;
    const finance = data.finance;
    
    // Determine case status (สถานะผู้ใช้งาน: Active/Inactive)
    let status = 'Active';
    if (profile.patient_status) status = profile.patient_status;

    // Determine patient clinical status (สถานะผู้ป่วย: ปกติ/เสียชีวิต/etc.)
    const patientStatusLabel = profile.patient_status_label || 'ปกติ';

    // Timeline mapping
    const timeline = diagnosis.treatment_plan.map((plan: any) => ({
        age: plan.appropriate_age,
        stage: plan.task,
        status: plan.status.toLowerCase(),
        date: computeEstimatedDate(profile.dob, plan.appropriate_age) || '-',
        estimatedDate: computeEstimatedDate(profile.dob, plan.appropriate_age),
        secondaryBookings: plan.secondary_bookings || []
    }));

    // Funding mapping
    const funding = finance.received_grants.map((grant: any) => ({
        type: grant.source_name,
        status: grant.status, // Keep original Case (PascalCase preferred)
        amount: grant.amount.toString(),
        reason: grant.request_reason || 'เพื่อใช้ในการรักษาและฟื้นฟูสมรรถภาพ'
    }));

    // NEW: Funds UI structure for PatientProfileTab
    const funds = [];
    finance.received_grants.forEach((grant: any) => {
        funds.push({
            name: grant.source_name,
            amount: grant.amount,
            status: grant.status, 
            date: grant.date_received ? formatThaiDateShortData(grant.date_received) : undefined,
            dateRaw: grant.date_received || undefined,
            approvedDate: grant.approved_date || undefined,
            rejectedDate: grant.rejected_date || undefined,
            reason: grant.request_reason || 'เพื่อใช้ในการรักษาและฟื้นฟูสมรรถภาพ',
            historyTitle: 'ประวัติทุนสงเคราะห์',
            history: (finance.expenditure_records || [])
                .filter((ex: any) => ex.grant_source === grant.source_name)
                .map((ex: any) => ({
                    type: ex.reason,
                    status: (ex.status || 'approved').toLowerCase(),
                    date: formatThaiDateShortData(ex.date),
                    amount: ex.amount
                }))
        });
    });
    if (finance.travel_reimbursement && finance.travel_reimbursement.length > 0) {
        funds.push({
            name: 'กองทุนฟื้นฟูสมรรถภาพ จ.เชียงใหม่',
            amount: finance.travel_reimbursement.reduce((acc: number, curr: any) => acc + curr.amount, 0),
            status: 'Approved', // Default for travel reimbursement
            historyTitle: 'ประวัติทุนสงเคราะห์',
            history: finance.travel_reimbursement.map((tr: any) => ({
                type: `ค่าพาหนะ (${tr.route})`,
                status: (tr.status || 'approved').toLowerCase(),
                date: formatThaiDateShortData(tr.date),
                amount: tr.amount
            }))
        });
    }

    // Diagnosis Tags
    const diagnosisTags = [diagnosis.diagnosis];
    if (diagnosis.diagnosis.includes('Cleft Lip')) diagnosisTags.push('Cleft Lip');
    if (diagnosis.diagnosis.includes('Cleft Palate')) diagnosisTags.push('Cleft Palate');
    
    // Find next appointment (using updated demo date)
    const nextAppt = data.appointments.find((appt: any) => new Date(appt.date_time) >= new Date('2025-12-04'));
    
    // Use ID Card or Generated Code or Index as ID/HN
    const hn = profile.hn || `HN-${index + 1}`.padStart(8, '0');
    const id = `P${index + 1}`.padStart(4, '0');

    // Default image if null
    // Ensure we handle explicit null or string "null"
    const hasProfilePic = profile.profile_picture && profile.profile_picture !== "null";
    const image = hasProfilePic 
        ? profile.profile_picture 
        : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"; // Fallback

    // Additional fields for Dashboard compatibility (flattening)
    // We pick the first relevant appointment for the 'date'/'time' fields used in Dashboard
    const dashboardAppt = nextAppt || data.appointments[0]; 

    return {
        id: id,
        hn: hn,
        cid: profile.id_card || '-',
        name: profile.full_name_th || profile.full_name_en,
        age: calculateAge(profile.dob),
        dob: profile.dob || '',
        gender: profile.gender || undefined,
        diagnosis: diagnosis.diagnosis,
        status: status,
        patientStatusLabel: patientStatusLabel,
        hospital: insurance.main_affiliation,
        responsibleHealthCenter: insurance.pcu_affiliation || '-',
        contact: {
            name: profile.guardian?.name || '-',
            phone: profile.guardian?.phone || profile.phone || '-',
            homePhone: profile.home_phone || '-',
            address: profile.address ? `${profile.address.house_no}${profile.address.moo && profile.address.moo !== '-' && profile.address.moo !== '0' ? ' ม.' + profile.address.moo : ''}${profile.address.soi && profile.address.soi !== '-' ? ' ซ.' + profile.address.soi : ''}${profile.address.road && profile.address.road !== '-' ? ' ถ.' + profile.address.road : ''} ต.${profile.address.sub_district} อ.${profile.address.district} จ.${profile.address.province}${profile.address.zipcode ? ' ' + profile.address.zipcode : ''}` : '-',
            zipcode: profile.address?.zipcode || '',
            relation: profile.guardian?.relationship,
            // New fields mapping
            idCard: profile.guardian?.id_card || '-',
            dob: profile.guardian?.dob || '-',
            age: profile.guardian?.age || '-',
            occupation: profile.guardian?.occupation || '-',
            status: profile.guardian?.status || '-'
        },
        rights: insurance.insurance_type,
        // New Fields Mapping
        race: profile.race || '-',
        nationality: profile.nationality || '-',
        religion: profile.religion || '-',
        maritalStatus: profile.marital_status || '-',
        occupation: profile.occupation || '-',
        bloodGroup: profile.blood_group || '-',
        allergies: profile.allergies || '-',
        email: profile.email || '-',
        // Address breakdown
        addressNo: profile.address?.house_no || '-',
        addressMoo: profile.address?.moo || '-',
        addressSoi: profile.address?.soi || '-',
        addressRoad: profile.address?.road || '-',
        addressPostalCode: profile.address?.zipcode || '-',
        addressProvince: profile.address?.province || '-',
        addressDistrict: profile.address?.district || '-',
        addressSubDistrict: profile.address?.sub_district || '-',
        hospitalInfo: {
            // distance: insurance.distance_km || 0,
            // travelTime: insurance.travel_time_mins || 0,
            firstDate: insurance.first_treatment_date || '',
            responsibleRph: insurance.pcu_affiliation || '-'
        },
        funds: funds,
        diagnosisTags: diagnosisTags,
        doctor: diagnosis.diagnosing_doctor,
        gpsLocation: profile.gps_location,
        nextAppointment: nextAppt ? `${nextAppt.date_time.split('T')[0]} ${nextAppt.date_time.split('T')[1]?.substring(0,5)}` : null,
        image: image,
        timeline: timeline,
        history: diagnosis.treatment_plan.map((plan: any, i: number) => {
            const appt = plan.appointment_id ? data.appointments.find((a:any)=>a.appointment_id === plan.appointment_id) : null;
            let dateStr = '-';
            let sortDate = '1900-01-01T00:00:00'; // Default low date
            
            if (appt) {
                const d = new Date(appt.date_time);
                dateStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                sortDate = appt.date_time;
            }

            return {
                id: i,
                date: dateStr,
                rawDate: sortDate,
                title: plan.task,
                detail: plan.task,
                doctor: diagnosis.diagnosing_doctor,
                department: appt?.room || 'OPD',
                hospital: insurance.main_affiliation,
                status: plan.status,
                // Mock Data for New Fields
                treatment: plan.task,
                chiefComplaint: 'มารับการรักษาตามนัด',
                presentIllness: '-',
                pastHistory: '-',
                diagnosis: diagnosis.diagnosis,
                treatmentResult: 'อาการทั่วไปปกติ แผลแห้งดี',
                treatmentPlan: 'นัดติดตามอา��ารต่อเนื่อง'
            };
        }),
        visitHistory: (data.referral_homevisit.home_visit_history || []).map((visit: any) => {
            const d = new Date(visit.date);
            const thaiDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            
            // Simulate request date if not present (e.g. 3 days before visit)
            let reqD = new Date(visit.date);
            if (visit.requestDate) {
                reqD = new Date(visit.requestDate);
            } else {
                reqD.setDate(d.getDate() - 3);
            }
            const thaiRequestDate = reqD.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });

            let status = 'Pending';
            const s = (visit.status || '').toLowerCase();
            if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'อยู่ในพื้นที่', 'ลงพื้นที่'].includes(s)) status = 'Completed';
            else if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) status = 'Rejected';
            else if (['nothome', 'not_home', 'not home', 'ไม่อยู่'].includes(s)) status = 'NotHome';
            else if (['notallowed', 'not_allowed', 'not allowed', 'ไม่อนุญาต'].includes(s)) status = 'NotAllowed';
            else if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(s)) status = 'InProgress';
            else if (['waitvisit', 'wait_visit', 'waiting', 'รอเยี่ยม'].includes(s)) status = 'WaitVisit';
            else status = 'Pending';

            return {
                date: thaiDate,
                rawDate: visit.date,
                requestDate: thaiRequestDate,
                rawRequestDate: reqD.toISOString(),
                title: visit.results || 'เยี่ยมบ้าน',
                note: visit.results,
                provider: visit.visitor,
                status: status,
                type: visit.visit_type || 'Joint',
                images: visit.photos || []
            };
        }),
        appointmentHistory: (data.appointments || []).map((appt: any) => {
            const s = appt.status;
            let status = 'waiting';
            if (['ยืนยันแล้ว', 'มาตามนัด', 'confirmed', 'checked-in'].includes(s)) status = 'confirmed';
            else if (['เสร็จสิ้น', 'completed'].includes(s)) status = 'completed';
            else if (['ยกเลิก', 'ขาดนัด', 'cancelled', 'missed'].includes(s)) status = 'cancelled';
            
            const d = new Date(appt.date_time);
            // Format: DD-MMM-YY (Thai)
            const thaiDate = d.toLocaleDateString('th-TH', { 
                day: 'numeric', 
                month: 'short', 
                year: '2-digit' 
            });
            const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Simulate request date (e.g. 7 days before)
            const reqD = new Date(d);
            reqD.setDate(d.getDate() - 7);
            const thaiRequestDate = reqD.toLocaleDateString('th-TH', { 
                day: 'numeric', 
                month: 'short', 
                year: '2-digit' 
            });

            return {
                date: thaiDate,
                rawDate: appt.date_time,
                time: timeStr,
                requestDate: thaiRequestDate,
                title: appt.type,
                location: appt.location,
                doctor: appt.doctor_name,
                room: appt.room,
                status: status,
                note: appt.status
            };
        }),

        // Appointments for PatientDetailView - merge raw appointments + treatment secondary bookings
        appointments: (() => {
            const rawAppts = (data.appointments || []).map((appt: any, ai: number) => {
                const d = new Date(appt.date_time);
                const dateStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
                const reqD = new Date(d); reqD.setDate(d.getDate() - 7);
                const reqDateStr = reqD.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                const parentPlan = diagnosis.treatment_plan.find((p: any) => p.appointment_id === appt.appointment_id);
                let apptStatus = 'waiting';
                const s = appt.status;
                if (['confirmed', 'checked-in', 'มาตามนัด', 'ยืนยันแล้ว'].includes(s)) apptStatus = 'confirmed';
                else if (['completed', 'เสร็จสิ้น'].includes(s)) apptStatus = 'completed';
                else if (['cancelled', 'missed', 'ขาดนัด', 'ยกเลิก'].includes(s)) apptStatus = 'cancelled';
                else apptStatus = 'waiting';
                return {
                    id: `apt-${appt.appointment_id || ai}`,
                    appointmentId: appt.appointment_id,
                    datetime: dateStr,
                    date: dateStr,
                    time: timeStr,
                    requestDate: reqDateStr,
                    detail: parentPlan ? parentPlan.task : appt.type,
                    location: appt.location,
                    room: appt.room,
                    doctor: appt.doctor_name,
                    status: apptStatus,
                    type: appt.type,
                    title: parentPlan ? parentPlan.task : appt.type,
                    note: parentPlan ? `แผนการรักษา: ${parentPlan.task} (ช่วงอายุ ${parentPlan.appropriate_age})` : '',
                    recorder: 'ระบบบันทึกอัตโนมัติ',
                    source: 'treatment_plan',
                };
            });
            const secondaryAppts: any[] = [];
            (diagnosis.treatment_plan || []).forEach((plan: any) => {
                if (plan.secondary_bookings && plan.secondary_bookings.length > 0) {
                    const parentAppt = plan.appointment_id ? data.appointments.find((a: any) => a.appointment_id === plan.appointment_id) : null;
                    plan.secondary_bookings.forEach((sb: any, sbIndex: number) => {
                        secondaryAppts.push({
                            id: `apt-sb-${plan.appointment_id || 'none'}-${sbIndex}`,
                            appointmentId: `${plan.appointment_id || 'none'}-SB${sbIndex}`,
                            datetime: sb.date,
                            date: sb.date,
                            time: sbIndex % 2 === 0 ? '09:00' : '10:30',
                            requestDate: sb.date,
                            detail: sb.title,
                            location: parentAppt?.location || insurance.main_affiliation,
                            room: parentAppt?.room || 'ห้องตรวจ 1',
                            doctor: parentAppt?.doctor_name || diagnosis.diagnosing_doctor,
                            status: plan.status === 'Completed' ? 'เสร็จสิ้น' : plan.status === 'Upcoming' ? 'นัดหมาย' : 'รอดำเนินการ',
                            type: sb.title,
                            title: sb.title,
                            note: `นัดหมายย่อยจากแผนการรักษา: ${plan.task}`,
                            recorder: 'ระบบบันทึกอัตโนมัติ',
                            source: 'secondary_booking',
                            parentTreatment: plan.task,
                        });
                    });
                }
            });
            return [...rawAppts, ...secondaryAppts];
        })(),

        referralHistory: (data.referral_homevisit.referral_history || []).map((ref: any) => {
            const d = new Date(ref.date);
            const thaiDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            
            let acceptedDateFormatted = null;
            if (ref.acceptedDate) {
                 const ad = new Date(ref.acceptedDate);
                 acceptedDateFormatted = ad.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            }

            // Urgency mapping — same logic as REFERRAL_DATA
            const urgencyMap: Record<string, string> = { 'routine': 'Routine', 'urgent': 'Urgent', 'emergency': 'Emergency' };
            const urgency = urgencyMap[(ref.urgency || 'routine').toLowerCase()] || 'Routine';

            return {
                date: thaiDate,
                rawDate: ref.date,
                acceptedDate: ref.acceptedDate,
                acceptedDateFormatted: acceptedDateFormatted,
                title: ref.reason,
                from: ref.from,
                to: ref.to,
                doctor: ref.doctor || diagnosis.diagnosing_doctor || '-',
                status: (() => {
                    const rs = (ref.status || '').toLowerCase();
                    if (['ตอบรับแล้ว', 'accepted'].includes(rs)) return 'Accepted';
                    if (['ถูกปฏิเสธ', 'rejected'].includes(rs)) return 'Rejected';
                    if (['เสร็จสิ้น', 'completed'].includes(rs)) return 'Completed';
                    if (['ยกเลิก', 'canceled', 'cancelled'].includes(rs)) return 'Canceled';
                    return 'Pending';
                })(),
                urgency: urgency,
                referralNo: `REF-${hn.substring(0,4)}-${index}`
            };
        }),
        teleConsultHistory: (data.tele_consultation || []).map((tele: any) => {
             // Append T00:00:00 for date-only strings to avoid UTC timezone shift
             const safeParse = (s: string) => s && s.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(s + 'T00:00:00') : new Date(s);
             const d = safeParse(tele.date_time);
             const thaiDate = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
             
             let requestDateFormatted = '-';
             if (tele.request_date) {
                 const rd = safeParse(tele.request_date);
                 requestDateFormatted = rd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
             }

             return {
                 date: thaiDate,
                 rawDate: tele.date_time,
                 requestDate: requestDateFormatted,
                 title: tele.treatmentDetails || 'Tele-consultation',
                 channel: tele.channel || 'mobile',
                 agency_name: tele.agency_name,
                 doctor: tele.doctor || '-',
                 treatmentDetails: tele.treatmentDetails || '-',
                 status: (() => {
                     const ts2 = (tele.status || '').toLowerCase();
                     if (['completed', 'เสร็จสิ้น'].includes(ts2)) return 'Completed';
                     if (['inprogress', 'in_progress'].includes(ts2)) return 'InProgress';
                     if (['cancelled', 'missed', 'ยกเลิก'].includes(ts2)) return 'Cancelled';
                     return 'Pending';
                 })(),
                 meetingLink: tele.meeting_link
             };
        }),
        funding: funding,

        // === Aliases for PatientDetailView compatibility ===
        // PatientDetailView uses 'referrals', 'homeVisits', 'teleConsults'
        // whereas above we have 'referralHistory', 'visitHistory', 'teleConsultHistory'
        referrals: (data.referral_homevisit.referral_history || []).map((ref: any, ri: number) => {
            const rd = new Date(ref.date);
            const thaiDate = rd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            // Status mapping — matches REFERRAL_DATA & operations
            const rawSt = (ref.status || '').toLowerCase();
            let refStatus: string = 'Pending';
            if (['ตอบรับแล้ว', 'accepted'].includes(rawSt)) refStatus = 'Accepted';
            else if (['ถูกปฏิเสธ', 'rejected'].includes(rawSt)) refStatus = 'Rejected';
            else if (['เสร็จสิ้น', 'completed'].includes(rawSt)) refStatus = 'Completed';
            else if (['ยกเลิก', 'canceled', 'cancelled'].includes(rawSt)) refStatus = 'Canceled';
            const urgencyMap2: Record<string, string> = { 'routine': 'Routine', 'urgent': 'Urgent', 'emergency': 'Emergency' };
            return {
                id: `ref-${ri}`,
                treatment: ref.reason || '-',
                date: thaiDate,
                status: refStatus,
                destination: ref.to || '-',
                sourceHospital: ref.from || insurance.main_affiliation,
                referralNo: `REF-${hn.substring(0,4)}-${ri}`,
                patientHn: hn,
                patientName: profile.full_name_th || profile.full_name_en,
                reason: ref.reason,
                diagnosis: diagnosis.diagnosis,
                urgency: urgencyMap2[(ref.urgency || 'routine').toLowerCase()] || 'Routine',
                doctor: ref.doctor || diagnosis.diagnosing_doctor,
                title: ref.reason,
                acceptedDate: ref.acceptedDate,
                from: ref.from,
                to: ref.to,
            };
        }),
        homeVisits: (data.referral_homevisit.home_visit_history || []).map((visit: any, vi: number) => {
            const vd = new Date(visit.date);
            const thaiDate = vd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            // Status mapping — matches patientData visitHistory
            let hvStatus = 'Pending';
            const hvs = (visit.status || '').toLowerCase();
            if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'อยู่ในพื้นที่', 'ลงพื้นที่'].includes(hvs)) hvStatus = 'Completed';
            else if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(hvs)) hvStatus = 'Rejected';
            else if (['nothome', 'not_home', 'ไม่อยู่'].includes(hvs)) hvStatus = 'NotHome';
            else if (['notallowed', 'not_allowed', 'ไม่อนุญาต'].includes(hvs)) hvStatus = 'NotAllowed';
            else if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(hvs)) hvStatus = 'InProgress';
            else if (['waitvisit', 'wait_visit', 'waiting', 'รอเยี่ยม'].includes(hvs)) hvStatus = 'WaitVisit';
            else if (['accepted', 'accept', 'รับงาน'].includes(hvs)) hvStatus = 'Accepted';
            // Request date
            let reqD2 = new Date(visit.date);
            if (visit.requestDate) reqD2 = new Date(visit.requestDate);
            else reqD2.setDate(vd.getDate() - 3);
            const thaiReqDate = reqD2.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            return {
                id: `hv-${vi}`,
                date: thaiDate,
                detail: visit.results || 'เยี่ยมบ้าน',
                status: hvStatus,
                visitType: visit.visit_type === 'Delegated' ? 'ฝากเยี่ยม' : 'เยี่ยมร่วม',
                visitor: visit.visitor || '-',
                result: visit.results || '-',
                requestDate: thaiReqDate,
                note: visit.results,
                time: visit.time,
            };
        }),
        teleConsults: (data.tele_consultation || []).map((tele: any, ti: number) => {
            const safeParse2 = (ss: string) => ss && ss.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(ss + 'T00:00:00') : new Date(ss);
            const td = safeParse2(tele.date_time);
            const thaiDate = td.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            const timeStr = td.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
            let teleReqDate = '-';
            if (tele.request_date) {
                const trd = safeParse2(tele.request_date);
                teleReqDate = trd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
            }
            // Status mapping — matches operations
            let teleStatus = 'Pending';
            const ts = (tele.status || '').toLowerCase();
            if (['completed', 'เสร็จสิ้น'].includes(ts)) teleStatus = 'Completed';
            else if (['inprogress', 'in_progress'].includes(ts)) teleStatus = 'InProgress';
            else if (['cancelled', 'missed', 'rejected', 'ยกเลิก'].includes(ts)) teleStatus = 'Cancelled';
            else teleStatus = 'Pending';
            return {
                id: `tc-${ti}`,
                title: tele.topic || 'Tele-consultation',
                detail: tele.topic || tele.result || '-',
                datetime: `${thaiDate} ${timeStr}`,
                date: tele.date_time,
                link: tele.meeting_link || '-',
                type: tele.channel === 'mobile' || tele.channel === 'Direct' ? 'Direct' : 'ViaHospital',
                doctor: tele.doctor || '-',
                status: teleStatus,
                requestDate: teleReqDate,
                consultResult: tele.result || '-',
                meetingLink: tele.meeting_link,
                channel: tele.channel,
                agency_name: tele.agency_name,
            };
        }),

        // Flattened fields for Dashboard
        date: dashboardAppt ? dashboardAppt.date_time.split('T')[0] : undefined,
        time: dashboardAppt ? dashboardAppt.date_time.split('T')[1]?.substring(0,5) : undefined,
        type: dashboardAppt ? dashboardAppt.type : undefined,
        room: dashboardAppt ? dashboardAppt.room : undefined,
        detail: dashboardAppt ? dashboardAppt.location : undefined,

        // Mapped fields for filters
        medicalCondition: diagnosis.diagnosis,
        province: profile.address?.province || '',
        apptStatus: (() => {
            const s = dashboardAppt?.status;
            if (!s) return undefined;
            if (['ยืนยันแล้ว', 'มาตามนัด', 'confirmed', 'checked-in'].includes(s)) return 'confirmed';
            if (['เสร็จสิ้น', 'completed'].includes(s)) return 'completed';
            if (['ยกเลิก', 'ขาดนัด', 'cancelled', 'missed'].includes(s)) return 'cancelled';
            return 'waiting';
        })(),
    };
});

// ===========================
// SINGLE-SOURCE LOOKUP HELPER
// ===========================
// ใช้ฟังก์ชันนี้เพื่อดึงข้อมูลผู้ป่วยจาก PATIENTS_DATA แหล่งเดียว
// ทุก Detail View ควรเรียกใช้แทนการ duplicate ข้อมูล
export function getPatientByHn(hn: string): Patient | undefined {
    if (!hn) return undefined;
    return PATIENTS_DATA.find(p => p.hn === hn);
}

export function getPatientById(id: string): Patient | undefined {
    if (!id) return undefined;
    return PATIENTS_DATA.find(p => p.id === id);
}

// Generate REFERRAL_DATA from JSON
export const REFERRAL_DATA = mockData.flatMap((data: any, index: number) => {
    const profile = data.personal_profile;
    const hn = profile.hn || profile.id_card || profile.generated_code || profile.passport_no || `HN-${index + 1}`;
    const name = profile.full_name_th || profile.full_name_en;
    const diagnosis = data.diagnosis_treatment?.diagnosis || 'Cleft Lip and Palate';

    return (data.referral_homevisit.referral_history || []).map((ref: any, refIndex: number) => {
        // Status mapping
        const rawStatus = (ref.status || '').toLowerCase();
        let status: string = 'Pending';
        if (['ตอบรับแล้ว', 'accepted'].includes(rawStatus)) status = 'Accepted';
        else if (['ถูกปฏิเสธ', 'rejected'].includes(rawStatus)) status = 'Rejected';
        else if (['เสร็จสิ้น', 'completed'].includes(rawStatus)) status = 'Completed';
        else if (['ยกเลิก', 'canceled', 'cancelled'].includes(rawStatus)) status = 'Canceled';
        else status = 'Pending';

        // Urgency mapping
        const urgencyMap: Record<string, string> = { 'routine': 'Routine', 'urgent': 'Urgent', 'emergency': 'Emergency' };
        const urgency = urgencyMap[(ref.urgency || 'routine').toLowerCase()] || 'Routine';

        // Determine type
        const isFromPCU = (ref.from || '').includes('รพ.สต.');
        const type = ref.type || (isFromPCU ? 'Refer Out' : 'Refer In');

        // Build timeline logs
        const logs: Array<{ date: string; status: string; description: string; actor: string }> = [];
        logs.push({ date: ref.date, status: 'Created', description: 'สร้างรายการส่งตัวผู้ป่วย', actor: ref.doctor || 'ระบบ CM' });
        logs.push({ date: ref.date, status: 'Sent', description: 'ส่งเรื่องไปยังโรงพยาบาลปลายทาง', actor: 'ระบบ CM' });
        if (status === 'Accepted' || status === 'Completed') {
            logs.push({ date: ref.acceptedDate?.split('T')[0] || ref.date, status: 'Accepted', description: 'โรงพยาบาลปลายทางตอบรับ', actor: ref.doctor || 'แพทย์ปลายทาง' });
        }
        if (status === 'Completed') {
            logs.push({ date: ref.acceptedDate?.split('T')[0] || ref.date, status: 'Completed', description: 'การรักษาเสร็จสิ้น', actor: ref.doctor || 'แพทย์ปลายทาง' });
        }
        if (status === 'Rejected') {
            logs.push({ date: ref.date, status: 'Rejected', description: 'โรงพยาบาลปลายทางปฏิเสธ', actor: 'แพทย์ปลายทาง' });
        }

        // Mock documents
        const documents = status !== 'Pending'
            ? ['ใบส่งตัวผู้ป่วย.pdf', 'ผลการตรวจวินิจฉัย.pdf']
            : ['ใบส่งตัวผู้ป่วย.pdf'];

        return {
            id: `REF-${index}-${refIndex}`,
            patientId: `PAT-${index}`,
            patientName: name,
            name: name,
            patientHn: hn,
            hn: hn,
            patientImage: profile.profile_picture,
            patientDob: profile.dob,
            patientGender: profile.gender,
            patientPhone: profile.phone || '08x-xxx-xxxx',
            insuranceType: data.hospital_insurance?.insurance_type || 'บัตรทอง',
            diagnosis: diagnosis,
            referralNo: `REF-${hn.substring(0,4)}-${refIndex}`,
            date: ref.date,
            referralDate: ref.date,
            lastUpdateDate: ref.acceptedDate?.split('T')[0] || ref.date,
            acceptedDate: ref.acceptedDate,
            time: '09:00',
            type: type as 'Refer Out' | 'Refer In',
            status: status,
            creatorRole: isFromPCU ? 'CM' : undefined,
            hospital: ref.from,
            sourceHospital: ref.from,
            destinationHospital: ref.to,
            destinationContact: ref.doctor || undefined,
            reason: ref.reason,
            urgency: urgency,
            documents: documents,
            logs: logs
        };
    });
});

// Generate HOME_VISIT_DATA from JSON
export const HOME_VISIT_DATA = mockData.flatMap((data: any, index: number) => {
    const profile = data.personal_profile;
    const hn = profile.hn || profile.id_card || profile.generated_code || profile.passport_no || `HN-${index + 1}`;
    const name = profile.full_name_th || profile.full_name_en;
    
    // Address format
    const addr = profile.address;
    const addressStr = addr 
        ? `${addr.house_no || ''} ${addr.moo ? 'ม.'+addr.moo : ''} ${addr.sub_district || ''} ${addr.district || ''} ${addr.province || ''}`.trim() 
        : 'ไม่ระบุที่อยู่';

    return (data.referral_homevisit.home_visit_history || []).map((visit: any, vIndex: number) => {
        // Calculate request date logic
        const d = new Date(visit.date);
        let reqD = new Date(visit.date);
        if (visit.requestDate) {
             reqD = new Date(visit.requestDate);
        } else {
             reqD.setDate(d.getDate() - 3);
        }
        const requestDateStr = reqD.toISOString().split('T')[0];

        let status = 'Pending';
        const s = (visit.status || '').toLowerCase();
        if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'อยู่ในพื้นที่', 'ลงพื้นที่'].includes(s)) status = 'Completed';
        else if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) status = 'Rejected';
        else if (['nothome', 'not_home', 'not home', 'ไม่อยู่'].includes(s)) status = 'NotHome';
        else if (['notallowed', 'not_allowed', 'not allowed', 'ไม่อนุญาต'].includes(s)) status = 'NotAllowed';
        else if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(s)) status = 'InProgress';
        else if (['waitvisit', 'wait_visit', 'waiting', 'รอเยี่ยม'].includes(s)) status = 'WaitVisit';
        else status = 'Pending';

        return {
            id: `VISIT-${index}-${vIndex}`,
            patientImage: profile.profile_picture,
            patientName: name,
            name: name,
            hn: hn,
            patientDob: profile.dob,
            patientGender: profile.gender,
            diagnosis: data.diagnosis_treatment?.diagnosis || 'Cleft Lip and Palate',
            patientPhone: profile.phone || '08x-xxx-xxxx',
            patientAddress: addressStr,
            date: visit.date,
            time: '10:00',
            type: visit.visit_type || 'Joint',
            status: status,
            detail: visit.results,
            rph: data.hospital_insurance?.pcu_affiliation || visit.visitor || '-',
            requestDate: requestDateStr,
            note: visit.results,
            images: visit.photos,
            data: visit.data || {}
        };
    });
});

// Generate TELEMED_DATA from JSON
export const TELEMED_DATA = mockData.flatMap((data: any, index: number) => {
    const profile = data.personal_profile;
    const hn = profile.hn || profile.id_card || profile.generated_code || profile.passport_no || `HN-${index + 1}`;
    const name = profile.full_name_th || profile.full_name_en;

    return (data.tele_consultation || []).map((tele: any, tIndex: number) => ({
        id: `TELE-${index}-${tIndex}`,
        patientImage: profile.profile_picture,
        patientName: name,
        name: name,
        hn: hn,
        patientDob: profile.dob,
        patientGender: profile.gender,
        diagnosis: data.diagnosis_treatment?.diagnosis || 'Cleft Lip and Palate',
        date: tele.date_time.split('T')[0],
        time: tele.date_time.split('T')[1]?.substring(0,5),
        requestDate: tele.request_date,
        type: 'Telemed',
        status: tele.status === 'เสร็จสิ้น' ? 'Completed' : 'Waiting',
        detail: tele.treatmentDetails || 'Tele-consultation',
        channel: tele.channel || 'mobile',
        agency_name: tele.agency_name,
        meetingLink: tele.meeting_link,
        doctor: tele.doctor || data.diagnosis_treatment?.diagnosing_doctor || '-',
        treatmentDetails: tele.treatmentDetails || 'ให้คำปรึกษาทางไกล',
        hospital: data.hospital_insurance?.main_affiliation || 'โรงพยาบาลฝาง'
    }));
});

// ── CASE MANAGER DATA ──
// Logic: 1 hospital → 1 CM, but 1 CM can serve multiple hospitals
export interface CaseManager {
    id: string;
    name: string;
    phone: string;
    email: string;
    image: string;
    position: string;
    hospitals: { id: string; name: string; province: string }[];
    patientCount: number;
    activeVisits: number;
    completedVisits: number;
    pendingFunds: number;
    status: 'active' | 'inactive' | 'leave';
    joinDate: string;
    lastActive: string;
    province: string;
}

export const CASE_MANAGER_DATA: CaseManager[] = [
    { id: 'CM-001', name: 'นางสาวสุภาพร วงศ์สกุล', phone: '081-234-5001', email: 'supaporn.w@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supaporn', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H001', name: 'รพ.มหาราชนครเชียงใหม่', province: 'เชียงใหม่' }], patientCount: 32, activeVisits: 4, completedVisits: 28, pendingFunds: 2, status: 'active', joinDate: '2023-03-15', lastActive: '2026-02-13T09:15:00', province: 'เชียงใหม่' },
    { id: 'CM-002', name: 'นางอรทัย ใจแก้ว', phone: '081-234-5002', email: 'orathai.j@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Orathai', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H002', name: 'รพ.นครพิงค์', province: 'เชียงใหม่' }, { id: 'H003', name: 'รพ.สันทราย', province: 'เชียงใหม่' }], patientCount: 45, activeVisits: 6, completedVisits: 52, pendingFunds: 3, status: 'active', joinDate: '2022-06-01', lastActive: '2026-02-13T08:30:00', province: 'เชียงใหม่' },
    { id: 'CM-003', name: 'นางสาวพิมพ์ใจ สายน้ำใส', phone: '081-234-5003', email: 'pimjai.s@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pimjai', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H004', name: 'รพ.ฝาง', province: 'เชียงใหม่' }], patientCount: 18, activeVisits: 3, completedVisits: 15, pendingFunds: 1, status: 'active', joinDate: '2024-01-10', lastActive: '2026-02-12T16:45:00', province: 'เชียงใหม่' },
    { id: 'CM-004', name: 'นายธนพล ศรีวิชัย', phone: '081-234-5004', email: 'thanapol.s@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thanapol', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H005', name: 'รพ.จอมทอง', province: 'เชียงใหม่' }, { id: 'H006', name: 'รพ.แม่แจ่ม', province: 'เชียงใหม่' }, { id: 'H007', name: 'รพ.อมก๋อย', province: 'เชียงใหม่' }], patientCount: 51, activeVisits: 8, completedVisits: 67, pendingFunds: 4, status: 'active', joinDate: '2021-09-20', lastActive: '2026-02-13T10:00:00', province: 'เชียงใหม่' },
    { id: 'CM-005', name: 'นางสาวแก้วตา ลือชา', phone: '081-234-5005', email: 'kaewta.l@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kaewta', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H008', name: 'รพ.เชียงรายประชานุเคราะห์', province: 'เชียงราย' }], patientCount: 27, activeVisits: 5, completedVisits: 30, pendingFunds: 2, status: 'active', joinDate: '2023-07-01', lastActive: '2026-02-13T07:50:00', province: 'เชียงราย' },
    { id: 'CM-006', name: 'นางลำดวน คำแก้ว', phone: '081-234-5006', email: 'lamduan.k@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lamduan', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H009', name: 'รพ.แม่จัน', province: 'เชียงราย' }, { id: 'H010', name: 'รพ.เวียงป่าเป้า', province: 'เชียงราย' }], patientCount: 36, activeVisits: 3, completedVisits: 41, pendingFunds: 1, status: 'active', joinDate: '2022-11-15', lastActive: '2026-02-12T14:20:00', province: 'เชียงราย' },
    { id: 'CM-007', name: 'นายวิทยา อินทร์สม', phone: '081-234-5007', email: 'wittaya.i@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wittaya', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H011', name: 'รพ.ลำพูน', province: 'ลำพูน' }], patientCount: 14, activeVisits: 2, completedVisits: 18, pendingFunds: 0, status: 'active', joinDate: '2024-04-01', lastActive: '2026-02-13T11:00:00', province: 'ลำพูน' },
    { id: 'CM-008', name: 'นางนภัสสร ดวงดี', phone: '081-234-5008', email: 'napatsorn.d@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Napatsorn', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H012', name: 'รพ.ลำปาง', province: 'ลำปาง' }, { id: 'H013', name: 'รพ.เกาะคา', province: 'ลำปาง' }], patientCount: 29, activeVisits: 4, completedVisits: 35, pendingFunds: 2, status: 'active', joinDate: '2023-01-05', lastActive: '2026-02-13T09:45:00', province: 'ลำปาง' },
    { id: 'CM-009', name: 'นางสาวจินดา แสงทอง', phone: '081-234-5009', email: 'jinda.s@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jinda', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H014', name: 'รพ.พะเยา', province: 'พะเยา' }], patientCount: 11, activeVisits: 1, completedVisits: 12, pendingFunds: 1, status: 'leave', joinDate: '2024-08-01', lastActive: '2026-02-10T15:30:00', province: 'พะเยา' },
    { id: 'CM-010', name: 'นายประเสริฐ แก้วมูล', phone: '081-234-5010', email: 'prasert.k@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prasert', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H015', name: 'รพ.แพร่', province: 'แพร่' }], patientCount: 20, activeVisits: 3, completedVisits: 22, pendingFunds: 1, status: 'active', joinDate: '2023-05-10', lastActive: '2026-02-13T08:00:00', province: 'แพร่' },
    { id: 'CM-011', name: 'นางสาวศิริพร ตันติวงศ์', phone: '081-234-5011', email: 'siriporn.t@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siriporn', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H016', name: 'รพ.น่าน', province: 'น่าน' }, { id: 'H017', name: 'รพ.ปัว', province: 'น่าน' }], patientCount: 23, activeVisits: 2, completedVisits: 26, pendingFunds: 0, status: 'active', joinDate: '2022-12-01', lastActive: '2026-02-13T10:30:00', province: 'น่าน' },
    { id: 'CM-012', name: 'นางสาววรรณา เลิศชัย', phone: '081-234-5012', email: 'wanna.l@cleft.or.th', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wanna', position: 'ผู้ประสานงาน CM', hospitals: [{ id: 'H018', name: 'รพ.แม่ฮ่องสอน', province: 'แม่ฮ่องสอน' }], patientCount: 9, activeVisits: 1, completedVisits: 10, pendingFunds: 1, status: 'inactive', joinDate: '2024-06-15', lastActive: '2026-01-28T12:00:00', province: 'แม่ฮ่องสอน' },
];

// ===========================
// ADD MOCK PATIENT UTILITY
// ===========================
const MOCK_NAMES_TH = [
    'เด็กชายภูมิ สายน้ำ', 'เด็กหญิงกัญญา แก้วใจ', 'เด็กชายธนกฤต สมศรี',
    'เด็กหญิงสุพิชญา มีสุข', 'เด็กชายปภาวิน ดีเลิศ', 'เด็กหญิงณิชา พรมมา',
    'เด็กชายกิตติพัฒน์ แสงดาว', 'เด็กหญิงพิมลวรรณ จิตดี', 'เด็กชายศุภกร วงศ์ดี',
    'เด็กหญิงชลธิชา ใจงาม'
];
const MOCK_DIAGNOSES = ['Cleft Lip', 'Cleft Palate', 'Cleft Lip and Palate'];
const MOCK_HOSPITALS_LIST = ['โรงพยาบาลฝาง', 'รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.ลำพูน', 'รพ.แม่ฮ่องสอน'];
const MOCK_PROVINCES_LIST = ['เชียงใหม่', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน'];
const MOCK_INSURANCE_LIST = ['บัตรทอง (UC)', 'ประกันสังคม', 'ข้าราชการ (เบิกตรง)', 'ผู้มีปัญหาสถานะทางทะเบียน'];
const MOCK_PCUS_LIST = ['รพ.สต.ริมใต้', 'รพ.สต.แม่งอน', 'รพ.สต.ช้างเผือก', 'รพ.สต.แม่สา', 'รพ.สต.เวียงเหนือ'];

let mockPatientCounter = PATIENTS_DATA.length;

export interface AddPatientInput {
    name?: string;
    dob?: string;
    gender?: string;
    diagnosis?: string;
    hospital?: string;
    province?: string;
    phone?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianRelation?: string;
    insuranceType?: string;
}

export function addMockPatient(input?: AddPatientInput): Patient {
    mockPatientCounter++;
    const idx = mockPatientCounter;
    const randItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const hn = `${68000000 + idx}`;
    const id = `P${String(idx).padStart(4, '0')}`;
    const name = input?.name || randItem(MOCK_NAMES_TH);
    const gender = input?.gender || (name.includes('ชาย') ? 'ชาย' : 'หญิง');
    const dob = input?.dob || `${2023 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const diagnosis = input?.diagnosis || randItem(MOCK_DIAGNOSES);
    const hospital = input?.hospital || randItem(MOCK_HOSPITALS_LIST);
    const province = input?.province || randItem(MOCK_PROVINCES_LIST);
    const phone = input?.phone || `08${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const newPatient: Patient = {
        id,
        hn,
        cid: `${1100100000000 + idx}`,
        name,
        age: calculateAge(dob),
        dob,
        gender,
        diagnosis,
        status: 'Active',
        patientStatusLabel: 'ปกติ',
        hospital,
        responsibleHealthCenter: randItem(MOCK_PCUS_LIST),
        contact: {
            name: input?.guardianName || `ผู้ปกครองของ ${name}`,
            phone: input?.guardianPhone || phone,
            homePhone: '-',
            address: `ต.ริมใต้ อ.แม่ริม จ.${province}`,
            relation: input?.guardianRelation || 'มารดา',
        },
        rights: input?.insuranceType || randItem(MOCK_INSURANCE_LIST),
        nextAppointment: null,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}${idx}`,
        timeline: [
            { age: '3 เดือน', stage: 'ผ่าตัดเย็บปากแหว่ง', status: 'upcoming', date: '-' }
        ],
        history: [],
        funding: [],
        funds: [],
        diagnosisTags: [diagnosis],
        doctor: 'นพ.ประเสริฐ ดีเยี่ยม',
        gpsLocation: { lat: 18.7 + Math.random() * 0.3, lng: 98.8 + Math.random() * 0.3 },
        province,
        nationality: 'ไทย',
        religion: 'พุทธ',
        visitHistory: [],
        appointmentHistory: [],
        appointments: [],
        referralHistory: [],
        teleConsultHistory: [],
    };

    PATIENTS_DATA.push(newPatient);
    return newPatient;
}

export function generateQuickMockPatients(count: number = 3): Patient[] {
    const results: Patient[] = [];
    for (let i = 0; i < count; i++) {
        results.push(addMockPatient());
    }
    return results;
}