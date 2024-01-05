interface PhoneNumberDictionary {
  [phone: string]: {
    num: number;
  };
}

interface Contact {
  name: string;
  address: string;
  phones: Partial<PhoneNumberDictionary>;
}

// api
function fetchContacts(): Promise<Contact[]> {
  const contacts: Contact[] = [
    {
      name: 'Tony',
      address: 'Malibu',
      phones: {
        home: {
          num: 11122223333,
        },
        office: {
          num: 44455556666,
        },
      },
    },
    {
      name: 'Banner',
      address: 'New York',
      phones: {
        home: {
          num: 77788889999,
        },
      },
    },
    {
      name: '마동석',
      address: '서울시 강남구',
      phones: {
        home: {
          num: 213423452,
        },
        studio: {
          num: 314882045,
        },
      },
    },
  ];
  return new Promise((resolve) => {
    setTimeout(() => resolve(contacts), 2000);
  });
}

// main
class AddressBook {
  contacts: Contact[] = [];

  constructor() {
    this.fetchData();
  }

  fetchData(): void {
    fetchContacts().then((response) => {
      this.contacts = response;
    });
  }

  findContactByName(name: string): Contact[] {
    return this.contacts.filter((contact) => contact.name === name);
  }

  findContactByAddress(address: string): Contact[] {
    return this.contacts.filter((contact) => contact.address === address);
  }

  findContactByPhone(phoneNumber: number, phoneType: string): Contact[] {
    return this.contacts.filter(
      (contact) => contact.phones[phoneType]?.num === phoneNumber
    );
  }

  addContact(contact: Contact): void {
    this.contacts.push(contact);
  }

  displayListByName(): string[] {
    return this.contacts.map((contact) => contact.name);
  }

  displayListByAddress(): string[] {
    return this.contacts.map((contact) => contact.address);
  }
  /* ------------------------------------------------ */
}

// findContactByPhone 함수의 문제점은
// 실제로 반환되는 값에서는 그 타입의 값이 들어있는지 알 수 없다. 예로 들면

const addressBook = new AddressBook();
const result = addressBook.findContactByPhone(1234, 'home');
result[0].address.home; // 이렇게 하면 에러가 난다.

// 이러면 사실상 함수를 사용하는 의미가 없다.
// 몰론 반환받는 값에 as { home: { num: number } } 를 붙이면 에러는 안나지만
// 이렇게 하면 반환되는 모든 곳을 찾아서 as를 붙여줘야한다.

// 반환받는 곳에서 as를 사용하지 않으면서 실제로 반환되는 값에서 그 타입의 값이 들어있는지 알 수 있는 방법이 없을까요?
