"""Regenerate the bundled, deterministic demo datasets using Python 3."""

import datetime
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / 'public' / 'mock-api'
BASE_DATE = datetime.date(2026, 10, 26)
BASES = [
    ('Studio Headphones', 'Audio', 89, 'audio'),
    ('Sunday Speaker', 'Audio', 64, 'speaker'),
    ('Pocket Earbuds', 'Audio', 59, 'earbuds'),
    ('Analog Turntable', 'Audio', 189, 'record'),
    ('Morning Radio', 'Audio', 79, 'radio'),
    ('Studio Microphone', 'Audio', 99, 'microphone'),
    ('Everyday Ceramic Mug', 'Home', 28, 'home'),
    ('Quiet Corner Vase', 'Home', 42, 'vase'),
    ('Gathering Bowl', 'Home', 34, 'bowl'),
    ('Slow Sunday Candle', 'Home', 24, 'candle'),
    ('Soft Landing Throw', 'Home', 69, 'blanket'),
    ('Passing Time Clock', 'Home', 54, 'clock'),
    ('Everywhere Tote', 'Everyday', 48, 'everyday'),
    ('Day Trip Bottle', 'Everyday', 32, 'bottle'),
    ('A Little Thought Notebook', 'Everyday', 18, 'notebook'),
    ('Golden Hour Sunglasses', 'Everyday', 65, 'sunglasses'),
    ('Little Things Pouch', 'Everyday', 22, 'pouch'),
    ('Rain Check Umbrella', 'Everyday', 36, 'umbrella'),
    ('Focus Desk Lamp', 'Workspace', 79, 'workspace'),
    ('Soft Touch Keyboard', 'Workspace', 95, 'keyboard'),
    ('A Better View Stand', 'Workspace', 58, 'stand'),
    ('Clear Space Organizer', 'Workspace', 38, 'organizer'),
    ('Quiet Click Mouse', 'Workspace', 49, 'mouse'),
    ('Fresh Start Desk Mat', 'Workspace', 35, 'mat'),
]
VARIANTS = ['', ' · Sand', ' · Sage', ' · Clay', ' · Ink', ' · Oat',
            ' · Moss', ' · Stone', ' · Dusk', ' · Natural']
COLORS = ['#e9e8dd', '#eee5d8', '#e3e9dd', '#eddfd4', '#e2e6e9',
          '#ebe7d9', '#dde5d5', '#e6e5df', '#e6e3eb', '#efe8db']


def generate():
    products = []
    for variant in range(10):
        for index, (name, category, price, image) in enumerate(BASES):
            identifier = variant * 24 + index + 1
            products.append({
                'id': identifier, 'name': name + VARIANTS[variant], 'category': category,
                'price': price + (variant % 3) * 2,
                'originalPrice': price + 20 if identifier % 5 == 1 else None,
                'rating': round(4.3 + ((identifier * 3) % 7) / 10, 1),
                'reviews': 24 + (identifier * 17) % 360,
                'image': f'/art/{image}.svg', 'color': COLORS[(variant + index // 6) % 10],
                'description': f'{name} brings a little intention to your everyday. '
                    'Thoughtful details, a timeless shape, and the kind of quality you can feel. '
                    'Made for slow mornings, busy afternoons, and all the moments in between.',
                'stock': 8 + (identifier * 7) % 90,
                'featured': variant == 0 and index in (0, 6, 12, 18),
            })
    first = ['Amira', 'Omar', 'Lina', 'Youssef', 'Maya', 'Adam', 'Nour', 'Karim',
             'Salma', 'Ali', 'Hana', 'Tarek', 'Farah', 'Ziad', 'Dina', 'Rami',
             'Layla', 'Mostafa', 'Yara', 'Hassan']
    last = ['Hassan', 'Adel', 'Mansour', 'Khalil', 'Nasser', 'Fahmy']
    cities = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Ismailia', 'Aswan', 'Tanta', 'Port Said']
    users = [{
        'id': index + 1, 'name': first[index % 20] + ' ' + last[index // 20],
        'email': f'{first[index % 20].lower()}.{last[index // 20].lower()}@example.test',
        'city': cities[index % 8],
        'joined': (BASE_DATE - datetime.timedelta(days=20 + index * 2)).isoformat(),
        'orders': 0, 'spent': 0,
        'status': 'New' if index % 7 == 0 else 'Active',
    } for index in range(120)]
    statuses = ['Delivered', 'Delivered', 'Processing', 'Shipped',
                'Delivered', 'Cancelled', 'Shipped', 'Processing']
    orders = []
    for index in range(320):
        items = []
        for offset in range(1 + index % 4):
            product = products[(index * 13 + offset * 29) % 240]
            items.append({'productId': product['id'], 'quantity': 1 + (index + offset) % 3,
                          'price': product['price']})
        subtotal = sum(item['price'] * item['quantity'] for item in items)
        total = round(subtotal + (5.99 if subtotal < 100 else 0), 2)
        user_id = (index * 7) % 120 + 1
        status = statuses[index % 8]
        orders.append({
            'id': 10400 + index, 'userId': user_id,
            'date': (BASE_DATE - datetime.timedelta(days=index % 90)).isoformat(),
            'status': status, 'items': items, 'total': total,
        })
        users[user_id - 1]['orders'] += 1
        if status != 'Cancelled':
            users[user_id - 1]['spent'] = round(users[user_id - 1]['spent'] + total, 2)
    ROOT.mkdir(parents=True, exist_ok=True)
    for name, rows in [('products', products), ('users', users), ('orders', orders)]:
        (ROOT / f'{name}.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Generated {len(products)} products, {len(users)} users, {len(orders)} orders.')


if __name__ == '__main__':
    generate()
