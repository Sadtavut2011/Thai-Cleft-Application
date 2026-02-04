// Embedding mock data directly to avoid JSON import issues in this environment
const mockData = [
  {
    "personal_profile": {
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
      "address": {
        "house_no": "123/4",
        "moo": "5",
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
      "email": "somchai.j@gmail.com",
      "guardian": {
        "name": "นายสมบูรณ์ ใจดี",
        "relationship": "บิดา",
        "phone": "081-234-5678",
        "occupation": "รับจ้างทั่วไป",
        "status": "Living"
      },
      "patient_status": "Active"
    },
    "hospital_insurance": {
      "main_affiliation": "รพ.มหาราชนครเชียงใหม่",
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
      "diagnosis": "Cleft Lip and Palate (ปากแหว่งเพดานโหว่)",
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
        "location": "รพ.มหาราชนครเชียงใหม่, ตึกศัลยกรรมชั้น 3",
        "doctor_name": "นพ.วิชัย เกียรติเกรียงไกร",
        "type": "ผ่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ1"
      },
      {
        "appointment_id": "APP-005",
        "date_time": "2024-06-15T09:00:00",
        "location": "รพ.มหาราชนครเชียงใหม่, ตึกศัลยกรรมชั้น 3",
        "doctor_name": "นพ.สมศักดิ์ รักงาน",
        "type": "ผ่าตัด",
        "status": "เสร็จสิ้น",
        "room": "ห้องตรวจ1"
      },
      {
        "appointment_id": "APP-006",
        "date_time": "2025-12-04T09:00:00",
        "location": "รพ.มหาราชนครเชียงใหม่, อาคารผู้ป่วยนอก",
        "doctor_name": "นพ.วิชัย เกียรติเกรียงไกร",
        "type": "ติดตามอาการ",
        "status": "รอพบแพทย์",
        "room": "ห้องตรวจ1"
      },
      {
        "appointment_id": "APP-007",
        "date_time": "2025-11-15T10:00:00",
        "location": "รพ.มหาราชนครเชียงใหม่, คลินิกฝึกพูด",
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
          "date_received": "2024-01-10",
          "status": "Approved",
          "request_reason": "ครอบครัวมีรายได้น้อย บิดาทำงานรับจ้างทั่วไปรายวัน ไม่เพียงพอต่อค่าใช้จ่ายในการเดินทางและค่าเวชภัณฑ์ส่วนเกิน"
        },
        {
          "source_name": "กองทุนช่วยเหลือฉุกเฉิน",
          "amount": 5000,
          "date_received": "2024-02-01",
          "status": "Pending",
          "request_reason": "ค่าใช้จ่ายฉุกเฉินในการเดินทางไปรักษาตัวที่โรงพยาบาลศูนย์"
        },
        {
            "source_name": "กองทุนพัฒนาคุณภาพชีวิต",
            "amount": 10000,
            "date_received": "2023-12-15",
            "status": "Rejected",
            "request_reason": "ขอสนับสนุนค่าใช้จ่ายในการซ่อมแซมที่อยู่อาศัย (ไม่อยู่ในเงื่อนไขกองทุน)"
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
          "date": "2024-03-10",
          "visitor": "รพ.สต.ริมใต้",
          "visit_type": "Delegated",
          "status": "อยู่ในพื้นที่", // InProgress/Working -> mapped to 'InProgress' in VisitDetail
          "results": "แผลผ่าตัดแห้งดี ทานนมได้ปกติ",
          "photos": ["visit_pic_01.png"],
          "data": {
              "patientName": "ด.ช. รักษา ดีจริง",
              "dob": "2023-01-10",
              "age": "2",
              "idCard": "1-5099-00123-45-6",
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
          "date": "2025-12-04",
          "visitor": "รพ.สต.ริมใต้",
          "visit_type": "Delegated",
          "status": "ลงพื้นที่",
          "results": "เยี่ยมติดตามอาการประจำเดือน",
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
        "meeting_link": "https://zoom.us/j/123456789",
        "status": "เสร็จสิ้น",
        "channel": "mobile"
      }
    ]
  },
  {
    "personal_profile": {
      "profile_picture": null,
      "full_name_th": "เด็กหญิงมานี มีนา",
      "full_name_en": "Manee Meena",
      "id_card": null,
      "passport_no": null,
      "generated_code": "TC-670001",
      "dob": "2022-05-20",
      "gender": "หญิง",
      "nationality": "ไม่มีสถานะทางทะเบียน",
      "religion": "คริสต์",
      "address": {
        "house_no": "99",
        "moo": "1",
        "sub_district": "เวียงเหนือ",
        "district": "ปาย",
        "province": "แม่ฮ่องสอน"
      },
      "gps_location": {
        "lat": 19.3582,
        "lng": 98.4404
      },
      "phone": "092-888-9999",
      "email": null,
      "guardian": {
        "name": "นางอาหมี่ มีนา",
        "relationship": "มารดา",
        "phone": "092-888-9999"
      },
      "patient_status": "Active"
    },
    "hospital_insurance": {
      "main_affiliation": "รพ.นครพิงค์",
      "treating_hospitals": ["รพ.นครพิงค์", "รพ.ปาย"],
      "pcu_affiliation": "ยังไม่ระบุ",
      "insurance_type": "ผู้มีปัญหาสถานะทางทะเบียน"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Palate (เพดานโหว่)",
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
        "location": "รพ.นครพิงค์",
        "doctor_name": "พญ.อรุณี รักดี",
        "type": "ผ่าตัด",
        "status": "ขาดนัด"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "ทุนสภากาชาดไทย",
          "amount": 20000,
          "date_received": "2023-11-20",
          "status": "Approved"
        },
        {
          "source_name": "กองทุนเพื่อผู้ยากไร้",
          "amount": 5000,
          "date_received": "2024-01-15",
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
          "date": "2025-12-04",
          "visitor": "CM อาสาสมัคร",
          "visit_type": "Joint",
          "status": "รอเยี่ยม",
          "results": "ยืนยันนัดหมายแล้ว รอลงพื้นที่",
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
        "date_time": "2025-12-04T10:00:00",
        "meeting_link": "https://meet.google.com/abc-defg-hij",
        "status": "รอดำเนินการ",
        "channel": "agency",
        "agency_name": "รพ.สต.หางดง"
      }
    ]
  },
  {
    "personal_profile": {
      "profile_picture": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      "full_name_th": "นาย จอห์น สมิธ",
      "full_name_en": "John Smith",
      "id_card": null,
      "passport_no": "AA55667788",
      "generated_code": null,
      "dob": "1995-08-12",
      "gender": "ชาย",
      "nationality": "อเมริกัน",
      "religion": "คริสต์",
      "address": {
        "house_no": "500",
        "moo": "0",
        "sub_district": "ช้างคลาน",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่"
      },
      "gps_location": {
        "lat": 18.7815,
        "lng": 98.995
      },
      "phone": "085-000-1111",
      "email": "john.smith@expat.com",
      "guardian": null,
      "patient_status": "Active"
    },
    "hospital_insurance": {
      "main_affiliation": "รพ.เชียงใหม่ราม",
      "treating_hospitals": ["รพ.เชียงใหม่ราม"],
      "pcu_affiliation": "ยังไม่ระบุ",
      "insurance_type": "ประกันชีวิตส่วนบุคคล"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip (ปากแหว่งด้านเดียว)",
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
        "location": "รพ.เชียงใหม่ราม แผนกความงาม",
        "doctor_name": "นพ.ธีระพล สุดหล่อ",
        "type": "ตรวจรักษา",
        "status": "มาตามนัด"
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
      "address": {
        "house_no": "1",
        "moo": "2",
        "sub_district": "ป่าแดด",
        "district": "เมือง",
        "province": "เชียงใหม่"
      },
      "gps_location": {
        "lat": 18.7523,
        "lng": 98.9812
      },
      "phone": "089-999-8888",
      "email": "mali@mail.com",
      "guardian": null,
      "patient_status": "Inactive"
    },
    "hospital_insurance": {
      "main_affiliation": "รพ.มหาราชนครเชียงใหม่",
      "treating_hospitals": ["รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.ป่าแดด",
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
          "date": "2026-03-15",
          "visitor": "รพ.สต.ป่าแดด",
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
      "address": {
        "house_no": "45",
        "moo": "3",
        "sub_district": "ศรีภูมิ",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่"
      },
      "gps_location": {
        "lat": 18.7902,
        "lng": 98.9844
      },
      "phone": "086-555-4444",
      "email": null,
      "guardian": {
        "name": "นายยอด ยอดดี",
        "relationship": "บิดา",
        "phone": "086-555-4444"
      },
      "patient_status": "Active"
    },
    "hospital_insurance": {
      "main_affiliation": "รพ.ฝาง",
      "treating_hospitals": ["รพ.ฝาง", "รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.ในเมือง",
      "insurance_type": "บัตรทอง (UC)"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip (ปากแหว่ง)",
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
          "status": "Pending",
          "appointment_id": "APP-205"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-205",
        "date_time": "2024-04-10T10:00:00",
        "location": "รพ.ฝาง ห้องผ่าตัด 1",
        "doctor_name": "นพ.ประเสริฐ ดีเยี่ยม",
        "type": "ผ่าตัด",
        "status": "รอพบแพทย์"
      },
      {
        "appointment_id": "APP-206",
        "date_time": "2025-12-04T10:30:00",
        "location": "รพ.มหาราชนครเชียงใหม่",
        "doctor_name": "นพ.ประเสริฐ ดีเยี่ยม",
        "type": "นัดหมายตรวจรักษา",
        "status": "รอพบแพทย์"
      }
    ],
    "finance": {
      "received_grants": [
        {
          "source_name": "ทุนอบจ.เชียงใหม่",
          "amount": 3000,
          "date_received": "2024-02-15",
          "status": "Approved"
        },
        {
          "source_name": "มูลนิธิขาเทียม",
          "amount": 10000,
          "date_received": "2024-03-01",
          "status": "Rejected"
        }
      ],
      "expenditure_records": [],
      "travel_reimbursement": []
    },
    "referral_homevisit": {
      "referral_history": [],
      "home_visit_history": [
        {
          "date": "2024-02-20",
          "visitor": "พยาบาลประจำตำบล",
          "visit_type": "Joint",
          "status": "อยู่ในพื้นที่",
          "results": "สุขภาพแข็งแรง นัดให้คำปรึกษาการให้นม",
          "photos": ["feed_01.jpg"]
        }
      ]
    },
    "communication": {
      "team_care_chat": [],
      "patient_chat": []
    },
    "tele_consultation": [
      {
        "date_time": "2024-03-01T15:00:00",
        "meeting_link": "https://meet.google.com/abc-defg-hij",
        "status": "รอดำเนินการ"
      }
    ]
  },
  {
    "personal_profile": {
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
      "address": {
        "house_no": "10/1",
        "moo": "4",
        "sub_district": "ช้างเผือก",
        "district": "เมืองเชียงใหม่",
        "province": "เชียงใหม่"
      },
      "gps_location": {
        "lat": 18.8064,
        "lng": 98.9745
      },
      "phone": "084-111-2222",
      "email": null,
      "guardian": {
        "name": "นางนภา รักดี",
        "relationship": "มารดา",
        "phone": "084-111-2222"
      },
      "patient_status": "Active"
    },
    "hospital_insurance": {
      "main_affiliation": "รพ.มหาราชนครเชียงใหม่",
      "treating_hospitals": ["รพ.มหาราชนครเชียงใหม่"],
      "pcu_affiliation": "รพ.สต.ช้างเผือก",
      "insurance_type": "ข้าราชการ (เบิกตรง)"
    },
    "diagnosis_treatment": {
      "diagnosis": "Cleft Lip and Palate",
      "diagnosing_doctor": "นพ.เกรียงไกร เก่งกาจ",
      "treatment_plan": [
        {
          "task": "จัดฟัน (Orthodontics)",
          "appropriate_age": "8-12 ปี",
          "status": "Pending",
          "appointment_id": "APP-555"
        }
      ]
    },
    "appointments": [
      {
        "appointment_id": "APP-555",
        "date_time": "2024-07-20T11:00:00",
        "location": "รพ.มหาราชนครเชียงใหม่ แผนกทันตกรรม",
        "doctor_name": "ทพญ.สมศรี มีฟัน",
        "type": "ติดตามอาการ",
        "status": "รอพบแพทย์"
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
  }
];

export interface Patient {
    id: string;
    hn: string;
    cid: string;
    name: string;
    age: string;
    dob: string;
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
    };
    rights: string;
    nextAppointment: string | null;
    image: string;
    timeline: Array<{
        age: string;
        stage: string;
        status: string;
        date: string;
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
    religion?: string;
    maritalStatus?: string;
    occupation?: string;
    bloodGroup?: string;
    allergies?: string;
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
    referralHistory?: any[];
    teleConsultHistory?: any[];
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

// Transform JSON to PATIENTS_DATA
export const PATIENTS_DATA: Patient[] = mockData.map((data: any, index: number) => {
    const profile = data.personal_profile;
    const insurance = data.hospital_insurance;
    const diagnosis = data.diagnosis_treatment;
    const finance = data.finance;
    
    // Determine status based on appointments or other logic
    let status = 'Active';
    if (profile.patient_status) status = profile.patient_status;

    // Timeline mapping
    const timeline = diagnosis.treatment_plan.map((plan: any) => ({
        age: plan.appropriate_age,
        stage: plan.task,
        status: plan.status.toLowerCase(),
        date: plan.appointment_id ? 'Completed' : 'Pending', // Simplified
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
            date: grant.date_received ? new Date(grant.date_received).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'}) : undefined,
            reason: grant.request_reason || 'เพื่อใช้ในการรักษาและฟื้นฟูสมรรถภาพ', // เพิ่ม field นี้
            historyTitle: 'ประวัติทุนสงเคราะห์',
            history: (finance.expenditure_records || [])
                .filter((ex: any) => ex.grant_source === grant.source_name)
                .map((ex: any) => ({
                    type: ex.reason,
                    status: (ex.status || 'approved').toLowerCase(),
                    date: new Date(ex.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'}),
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
                date: new Date(tr.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'}),
                amount: tr.amount
            }))
        });
    }

    // Appointment History
    const appointmentHistory = data.appointments.map((appt: any, i: number) => ({
        id: i + 1,
        date: new Date(appt.date_time).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        title: appt.type,
        detail: appt.location,
        doctor: appt.doctor_name,
        department: 'ศัลยกรรม', // Mock
        status: appt.status
    }));

    // Referral History
    const referralHistory = data.referral_homevisit.referral_history.map((ref: any, i: number) => ({
        id: i + 1,
        date: new Date(ref.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        from: ref.from,
        to: ref.to,
        reason: ref.reason,
        status: ref.status,
        acceptedDate: ref.acceptedDate ? new Date(ref.acceptedDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined,
        urgency: ref.urgency || 'Routine'
    }));

    // Home Visit History
    const visitHistory = data.referral_homevisit.home_visit_history.map((visit: any, i: number) => ({
        id: i + 1,
        date: new Date(visit.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        visitor: visit.visitor,
        status: visit.status,
        result: visit.results,
        photos: visit.photos
    }));

    // Tele Consult History
    const teleConsultHistory = data.tele_consultation.map((tele: any, i: number) => ({
        id: i + 1,
        date: new Date(tele.date_time).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: tele.status,
        link: tele.meeting_link
    }));

    return {
        id: (index + 1).toString(),
        hn: profile.generated_code || `HN-00${index + 1}`,
        cid: profile.id_card || `1-1000-00000-${index + 1}`,
        name: profile.full_name_th,
        age: calculateAge(profile.dob),
        dob: profile.dob,
        diagnosis: diagnosis.diagnosis,
        status: status,
        hospital: insurance.treating_hospitals[0],
        responsibleHealthCenter: insurance.pcu_affiliation,
        contact: {
            name: profile.guardian?.name || profile.full_name_th, // Fallback if self
            phone: profile.phone || profile.guardian?.phone || '-',
            homePhone: profile.home_phone,
            address: `${profile.address.house_no} ม.${profile.address.moo} ต.${profile.address.sub_district} อ.${profile.address.district} จ.${profile.address.province} ${profile.address.zipcode || ''}`,
            zipcode: profile.address.zipcode,
            relation: profile.guardian?.relationship || 'ตนเอง'
        },
        rights: insurance.insurance_type,
        nextAppointment: data.appointments.length > 0 ? new Date(data.appointments[0].date_time).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
        image: profile.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
        timeline: timeline,
        history: appointmentHistory,
        funding: funding,
        funds: funds,
        diagnosisTags: [diagnosis.diagnosis],
        doctor: diagnosis.diagnosing_doctor,
        gpsLocation: profile.gps_location,
        // Extended
        race: profile.race || 'ไทย',
        religion: profile.religion,
        maritalStatus: profile.marital_status,
        occupation: profile.occupation,
        bloodGroup: profile.blood_group,
        allergies: profile.allergies,
        hospitalInfo: {
            // distance: insurance.distance_km,
            // travelTime: insurance.travel_time_mins,
            firstDate: insurance.first_treatment_date ? new Date(insurance.first_treatment_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric'}) : '-',
            responsibleRph: insurance.pcu_affiliation
        },
        visitHistory,
        referralHistory,
        teleConsultHistory,
        appointmentHistory
    };
});

// Mock Data Generators for other lists (derived from PATIENTS_DATA for consistency)

export const REFERRAL_DATA = PATIENTS_DATA.flatMap(p => {
    // Generate referrals based on referral history
    return (p.referralHistory || []).map((ref: any, i: number) => ({
        id: `${p.id}-${i}`,
        date: '2025-12-04', // FORCE TODAY for demo
        time: '10:30',
        patientName: p.name,
        patientHn: p.hn,
        hospital: ref.from, // Origin
        destination: ref.to,
        status: ref.status, // Pending, Accepted
        urgency: ref.urgency,
        diagnosis: p.diagnosis,
        type: ref.to === 'รพ.มหาราชนครเชียงใหม่' ? 'Refer In' : 'Refer Out', // Simple logic
        patientId: p.id
    }));
});

export const HOME_VISIT_DATA = PATIENTS_DATA.flatMap(p => {
    return (p.visitHistory || []).map((v: any, i: number) => ({
        id: `${p.id}-${i}`,
        date: '2025-12-04', // FORCE TODAY
        time: '13:00',
        name: p.name,
        hn: p.hn,
        rph: p.responsibleHealthCenter,
        status: v.status, // Pending, InProgress, Completed
        type: 'Routine Visit',
        patientId: p.id
    }));
});

export const TELEMED_DATA = PATIENTS_DATA.flatMap(p => {
    return (p.teleConsultHistory || []).map((t: any, i: number) => ({
        id: `${p.id}-${i}`,
        date: '2025-12-04', // FORCE TODAY
        time: '14:00',
        name: p.name,
        hn: p.hn,
        status: t.status, // Pending, Completed
        channel: 'mobile',
        patientId: p.id
    }));
});
