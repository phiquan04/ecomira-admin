--
-- PostgreSQL database dump
--

\restrict HXhAGlLrDxOPz4MRcFKrb5zOOF9UPfyxcG4e40eT3q1qH32IC8voO49ieOeizlB

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-29 16:56:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 885 (class 1247 OID 16776)
-- Name: KYCStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."KYCStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."KYCStatus" OWNER TO postgres;

--
-- TOC entry 876 (class 1247 OID 16734)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'shipping',
    'delivered',
    'cancelled',
    'returned'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- TOC entry 879 (class 1247 OID 16750)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'cod',
    'bank_transfer',
    'momo',
    'zalopay',
    'credit_card',
    'spaylater'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- TOC entry 888 (class 1247 OID 16784)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 16764)
-- Name: SPayLaterStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SPayLaterStatus" AS ENUM (
    'PENDING',
    'PARTIALLY_PAID',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public."SPayLaterStatus" OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 16728)
-- Name: UserType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserType" AS ENUM (
    'customer',
    'seller',
    'admin'
);


ALTER TYPE public."UserType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16852)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    icon text,
    color text,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16851)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 238 (class 1259 OID 16985)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id integer NOT NULL,
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    last_message text,
    last_message_time timestamp(3) without time zone,
    unread_count_user1 integer DEFAULT 0 NOT NULL,
    unread_count_user2 integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16984)
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_id_seq OWNER TO postgres;

--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 237
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- TOC entry 240 (class 1259 OID 17004)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    product_id integer,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17003)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 239
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 230 (class 1259 OID 16894)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    seller_id integer NOT NULL,
    product_name text NOT NULL,
    price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    image text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16893)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 229
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 228 (class 1259 OID 16868)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number text NOT NULL,
    customer_id integer NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    shipping_fee numeric(10,2) DEFAULT 0 NOT NULL,
    status public."OrderStatus" DEFAULT 'pending'::public."OrderStatus" NOT NULL,
    payment_method public."PaymentMethod" NOT NULL,
    payment_status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    shipping_name text NOT NULL,
    shipping_phone text NOT NULL,
    shipping_address text NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16867)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 224 (class 1259 OID 16828)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    category_id integer NOT NULL,
    seller_id integer NOT NULL,
    images text[],
    rating numeric(3,2) DEFAULT 0,
    sold_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16827)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 223
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 222 (class 1259 OID 16813)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16812)
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO postgres;

--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 221
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- TOC entry 232 (class 1259 OID 16913)
-- Name: spaylater_customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spaylater_customers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    credit_limit numeric(12,2) DEFAULT 2000000 NOT NULL,
    available_credit numeric(12,2) DEFAULT 2000000 NOT NULL,
    used_credit numeric(12,2) DEFAULT 0 NOT NULL,
    total_paid numeric(12,2) DEFAULT 0 NOT NULL,
    total_overdue numeric(12,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    kyc_status public."KYCStatus" DEFAULT 'PENDING'::public."KYCStatus" NOT NULL,
    bank_account text,
    bank_name text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spaylater_customers OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16912)
-- Name: spaylater_customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spaylater_customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spaylater_customers_id_seq OWNER TO postgres;

--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 231
-- Name: spaylater_customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spaylater_customers_id_seq OWNED BY public.spaylater_customers.id;


--
-- TOC entry 236 (class 1259 OID 16965)
-- Name: spaylater_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spaylater_payments (
    id integer NOT NULL,
    transaction_id integer NOT NULL,
    customer_id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    payment_method text NOT NULL,
    payment_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.spaylater_payments OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16964)
-- Name: spaylater_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spaylater_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spaylater_payments_id_seq OWNER TO postgres;

--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 235
-- Name: spaylater_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spaylater_payments_id_seq OWNED BY public.spaylater_payments.id;


--
-- TOC entry 234 (class 1259 OID 16941)
-- Name: spaylater_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spaylater_transactions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    order_id integer,
    amount numeric(12,2) NOT NULL,
    paid_amount numeric(12,2) DEFAULT 0 NOT NULL,
    purchase_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    status public."SPayLaterStatus" DEFAULT 'PENDING'::public."SPayLaterStatus" NOT NULL,
    late_fee numeric(12,2) DEFAULT 0 NOT NULL,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spaylater_transactions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16940)
-- Name: spaylater_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spaylater_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spaylater_transactions_id_seq OWNER TO postgres;

--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 233
-- Name: spaylater_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spaylater_transactions_id_seq OWNED BY public.spaylater_transactions.id;


--
-- TOC entry 220 (class 1259 OID 16794)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    password_hash text NOT NULL,
    user_type public."UserType" NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16793)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4834 (class 2604 OID 16855)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4863 (class 2604 OID 16988)
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- TOC entry 4867 (class 2604 OID 17007)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4842 (class 2604 OID 16897)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4837 (class 2604 OID 16871)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 16831)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 16816)
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- TOC entry 4844 (class 2604 OID 16916)
-- Name: spaylater_customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_customers ALTER COLUMN id SET DEFAULT nextval('public.spaylater_customers_id_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 16968)
-- Name: spaylater_payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_payments ALTER COLUMN id SET DEFAULT nextval('public.spaylater_payments_id_seq'::regclass);


--
-- TOC entry 4853 (class 2604 OID 16944)
-- Name: spaylater_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_transactions ALTER COLUMN id SET DEFAULT nextval('public.spaylater_transactions_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 16797)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5097 (class 0 OID 16852)
-- Dependencies: 226
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, icon, color, description, is_active, created_at, updated_at) FROM stdin;
1	Điện thoại	phone-portrait	#EF4444	Smartphone và thiết bị di động	t	2025-11-09 03:47:29.518	2025-11-09 03:47:29.518
3	Tai nghe	headset	#10B981	Tai nghe và âm thanh	t	2025-11-09 03:47:29.527	2025-11-09 03:47:29.527
4	Đồng hồ	watch	#F59E0B	Đồng hồ thông minh và truyền thống	t	2025-11-09 03:47:29.53	2025-11-09 03:47:29.53
5	Máy ảnh	camera	#8B5CF6	Máy ảnh và phụ kiện	t	2025-11-09 03:47:29.534	2025-11-09 03:47:29.534
6	Phụ kiện	gift	#EC4899	Phụ kiện điện tử	t	2025-11-09 03:47:29.538	2025-11-09 03:47:29.538
2	Laptop	laptop	#3B82F6	Máy tính xách tay	t	2025-11-09 03:47:29.524	2025-11-25 13:57:22.987
\.


--
-- TOC entry 5109 (class 0 OID 16985)
-- Dependencies: 238
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, user1_id, user2_id, last_message, last_message_time, unread_count_user1, unread_count_user2, created_at, updated_at) FROM stdin;
3	2	4	Xin chào, tôi quan tâm đến cửa hàng của bạn	2025-11-29 08:45:53.835	0	0	2025-11-29 08:45:38.017	2025-11-29 08:50:10.546
1	4	2	Hết hàng rồi ạ	2025-11-29 08:49:12.588	0	0	2025-11-22 16:54:41.454	2025-11-29 08:50:16.82
2	4	12	aloalo	2025-11-29 06:34:51.26	0	1	2025-11-29 06:32:51.004	2025-11-29 08:50:32.064
\.


--
-- TOC entry 5111 (class 0 OID 17004)
-- Dependencies: 240
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, conversation_id, sender_id, receiver_id, content, message_type, product_id, is_read, created_at) FROM stdin;
1	1	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-22 17:06:01.836
2	1	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-22 17:06:21.454
3	1	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-22 17:07:05.979
4	1	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-22 17:17:13.007
5	1	4	2	xin chaof	text	\N	t	2025-11-22 17:17:19.515
6	1	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-23 01:56:14.457
7	1	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-23 01:56:25.225
8	1	4	2	halo	text	\N	t	2025-11-23 01:56:35.711
9	1	4	2	alo	text	\N	t	2025-11-29 06:33:09.994
10	2	4	12	aloalo	text	\N	f	2025-11-29 06:34:51.256
11	3	4	2	Xin chào, tôi quan tâm đến cửa hàng của bạn	text	\N	t	2025-11-29 08:45:53.827
12	1	2	4	Cảm ơn bạn!	text	\N	t	2025-11-29 08:49:07.302
13	1	2	4	Hết hàng rồi ạ	text	\N	t	2025-11-29 08:49:12.584
\.


--
-- TOC entry 5101 (class 0 OID 16894)
-- Dependencies: 230
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, seller_id, product_name, price, quantity, subtotal, image, created_at) FROM stdin;
\.


--
-- TOC entry 5099 (class 0 OID 16868)
-- Dependencies: 228
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, customer_id, total_amount, shipping_fee, status, payment_method, payment_status, shipping_name, shipping_phone, shipping_address, note, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5095 (class 0 OID 16828)
-- Dependencies: 224
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, category_id, seller_id, images, rating, sold_count, is_active, created_at, updated_at) FROM stdin;
1	Điện thoại iPhone 17 Pro Max 256GB	Thông số kỹ thuật\nKích thước màn hình: 6.3 inches\nCông nghệ màn hình: Super Retina XDR OLED\nCamera sau: Camera chính: 48MP, f/1.78, 24mm, chống rung quang học dịch chuyển cảm biến thế hệ thứ hai, Focus Pixels 100%, hỗ trợ ảnh có độ phân giải siêu cao\nHỗ trợ Telephoto 2x 12MP: 52 mm, ƒ/1.6\nCamera góc siêu rộng: 48MP, 13 mm, ƒ/2.2 và trường ảnh 120°, H\nCamera trước: 12MP, ƒ/1.9, Tự động lấy nét theo pha Focus Pixels\nChipset: Apple A18 Pro\nCông nghệ NFC: Có\nBộ nhớ trong: 128 GB\nThẻ SIM: Sim kép (nano-Sim và e-Sim) - Hỗ trợ 2 e-Sim\nHệ điều hành: iOS 18\nĐộ phân giải màn hình: 2622 x 1206 pixels\nTính năng màn hình: Dynamic Island, Màn hình HDR, True Tone, Dải màu rộng (P3), Haptic Touch, Tỷ lệ tương phản 2.000.000:1, Độ sáng tối đa 1000 nit, 460 ppi, Lớp phủ kháng dầu chống in dấu vân tay, Hỗ trợ hiển thị đồng thời nhiều ngôn ngữ và ký tự\nLoại CPU: CPU 6 lõi mới với 2 lõi hiệu năng và 4 lõi tiết kiệm điện\nTương thích: Tương Thích Với Thiết Bị Trợ Thính	37990000.00	200	1	2	{https://res.cloudinary.com/dnui1a2v5/image/upload/v1762681117/ecomira/products/bsvl8vit3jiypnjno9ff.jpg,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762681117/ecomira/products/w125gexclbir8wjjonhz.jpg,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762681117/ecomira/products/qdrwepdqgde6rz0zrun4.jpg,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762681117/ecomira/products/s6eyn16pfy17oeyuzhno.jpg}	0.00	0	t	2025-11-09 09:44:01.73	2025-11-09 09:44:01.73
3	iPhone 15 Pro Max 256GB | Chính hãng VN/A	Thông số kỹ thuật\nKích thước màn hình: 6.7 inches\nCông nghệ màn hình: Super Retina XDR OLED\nCamera sau: Camera chính: 48MP, 24 mm, ƒ/1.78\nCamera góc siêu rộng: 12 MP, 13 mm, ƒ/2.2\nCamera Tele: 12 MP\nCamera trước: 12MP, ƒ/1.9\nChipset: Apple A17 Pro 6 nhân\nCông nghệ NFC: Có\nDung lượng RAM: 8 GB\nBộ nhớ trong: 256 GB\nPin: 4422 mAh\nThẻ SIM: 2 SIM (nano‑SIM và eSIM)\nHệ điều hành: iOS 17\nĐộ phân giải màn hình: 2796 x 1290-pixel\nTính năng màn hình: Tốc độ làm mới 120Hz, 460 ppi, 2000 nits, HDR, True Tone, Dải màu rộng (P3), Haptic Touch, Tỷ lệ tương phản 2.000.000:1\nLoại CPU: CPU 6 lõi mới với 2 lõi hiệu năng và 4 lõi hiệu suất	25990000.00	350	1	2	{https://res.cloudinary.com/dnui1a2v5/image/upload/v1762682007/ecomira/products/xsmav9wptfpfufq6vx6w.jpg,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762682006/ecomira/products/r3itxnmeex0lgnu92jy1.jpg,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762682007/ecomira/products/wthwusegsntbsxavymfi.jpg,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762682010/ecomira/products/n9jdzjpwzrkzcxjxbtkr.png,https://res.cloudinary.com/dnui1a2v5/image/upload/v1762682007/ecomira/products/jfdqtwpj6kkovxmuc3qw.jpg}	0.00	0	t	2025-11-09 09:53:58.389	2025-11-09 09:53:58.389
\.


--
-- TOC entry 5093 (class 0 OID 16813)
-- Dependencies: 222
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, token, expires_at, created_at) FROM stdin;
11	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2MzgyODY0NSwiZXhwIjoxNzY0NDMzNDQ1fQ.LZjKx--ycl_d0RW4KdPewJUPo1NgO2y1tb8PODryzBQ	2025-11-29 16:24:05.475	2025-11-22 16:24:05.477
12	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzYzODI4OTQ4LCJleHAiOjE3NjQ0MzM3NDh9.5qGXSOySvm_KQ4qfpAPGvCrArf8Y_0y4z1af5iSL6mY	2025-11-29 16:29:08.676	2025-11-22 16:29:08.679
13	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzYzODMwODAxLCJleHAiOjE3NjQ0MzU2MDF9.hjORrigwH3swWjp5rwVqKYTrRH3kyyu-A6xBlOtGf-0	2025-11-29 17:00:01.228	2025-11-22 17:00:01.23
14	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2MzgzMTg3OCwiZXhwIjoxNzY0NDM2Njc4fQ.0hjD_luHxgMrSi330rNa8bx1RWOpz13sxvIcxzyPfZQ	2025-11-29 17:17:58.584	2025-11-22 17:17:58.586
15	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2Mzg2Mjc0MiwiZXhwIjoxNzY0NDY3NTQyfQ.7T9gcE9gtcaiz2IOPJSNP2dhh1XCxy3FaBWmhLsTOZk	2025-11-30 01:52:22.809	2025-11-23 01:52:22.811
16	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzYzODYyODE4LCJleHAiOjE3NjQ0Njc2MTh9.cGJBPo_Csa9f3ZX9wtJFAvWyyRminXe1EHZOXqFaTOA	2025-11-30 01:53:38.999	2025-11-23 01:53:39.001
17	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2Mzg2MzAyMCwiZXhwIjoxNzY0NDY3ODIwfQ.68KQydHTDvf1wKYKBGvLMYM1mOoEfD2rA3gCMVgQjIs	2025-11-30 01:57:00.962	2025-11-23 01:57:00.963
18	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2Mzk1MzExNiwiZXhwIjoxNzY0NTU3OTE2fQ.rQyApzXL8lEov1kQLkAuQFz2JzJEQxmnwLSYHEpvdLI	2025-12-01 02:58:36.247	2025-11-24 02:58:36.252
19	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0MzU3ODA0LCJleHAiOjE3NjQ5NjI2MDR9.uJgTnBipSU07ta8ow-vxqWAO62yD5hLlaVylcyL4MyI	2025-12-05 19:23:24.68	2025-11-28 19:23:24.685
20	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0MzgxNzk2LCJleHAiOjE3NjQ5ODY1OTZ9.GH4W3iCzYer6-WS-iimGFMUj7rIR6kQ-jG8ivCCZkAE	2025-12-06 02:03:16.474	2025-11-29 02:03:16.479
21	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0Mzg0ODY1LCJleHAiOjE3NjQ5ODk2NjV9.iSuyxWPJqjPKScrxeIVRrUwduTx1PjZknhlb_Dipugk	2025-12-06 02:54:25.427	2025-11-29 02:54:25.432
22	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0Mzg1MDc2LCJleHAiOjE3NjQ5ODk4NzZ9._n_MNHf_d8FbQvbv6wnPXHiRjxx_oTsGzOcYswz0ikY	2025-12-06 02:57:56.756	2025-11-29 02:57:56.758
23	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0Mzg1MTM1LCJleHAiOjE3NjQ5ODk5MzV9.Vf-d9-BWZcOjaahKQN24OUzLU2bKPyXeK0xWjVVrEJ8	2025-12-06 02:58:55.67	2025-11-29 02:58:55.671
24	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0Mzg1ODU4LCJleHAiOjE3NjQ5OTA2NTh9.rTCVOyrbrHdQAaHsG3hAV2Bb0zec6dp5ADkx34cAWBc	2025-12-06 03:10:58.395	2025-11-29 03:10:58.398
25	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0Mzk3OTQzLCJleHAiOjE3NjUwMDI3NDN9.dIXpDZ-_v8iMTAL-jyDh7DB68yC21PPk9Zl0EwtI3CA	2025-12-06 06:32:23.879	2025-11-29 06:32:23.882
26	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2NDM5ODAzNiwiZXhwIjoxNzY1MDAyODM2fQ.dfb4CKNs-fwEszz7r-CRpPonyJCuOLcLaXQkgjVfrns	2025-12-06 06:33:56.113	2025-11-29 06:33:56.114
27	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0Mzk4MDc0LCJleHAiOjE3NjUwMDI4NzR9.dBuwZ9oxVDHt2QnIKHLWqPX3hGvVOzaIdtInka46Ixc	2025-12-06 06:34:34.613	2025-11-29 06:34:34.614
28	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0NDAzNTczLCJleHAiOjE3NjUwMDgzNzN9.ihWPyn2bUEjbrny-3m3m8Al7zv4Rw8lo5iBumkFBTwY	2025-12-06 08:06:13.466	2025-11-29 08:06:13.47
29	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0NDA0Mzc4LCJleHAiOjE3NjUwMDkxNzh9.bAVCfKlg2rTiV4XM3jk8Zi532RZKc-3WRIFsq7mKuFU	2025-12-06 08:19:38.534	2025-11-29 08:19:38.538
30	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0NDA0OTc0LCJleHAiOjE3NjUwMDk3NzR9.jumJ19ML3lmboJJebmh-d4JebyMxXKTTOFzg6Agwneg	2025-12-06 08:29:34.797	2025-11-29 08:29:34.802
31	2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGhhb25oaUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6InNlbGxlciIsImlhdCI6MTc2NDQwNjExMiwiZXhwIjoxNzY1MDEwOTEyfQ.A4E1F7BwZXcfw7Z9uFkNEX6k2vX24TD8MrrcSuMLOBo	2025-12-06 08:48:32.812	2025-11-29 08:48:32.814
32	4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoicGhpcXVhbkBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzY0NDA2MTkxLCJleHAiOjE3NjUwMTA5OTF9.hc3Wsb-wdcM0LjzKjdWi0Ab28V1YPsfKcb583JmiMu8	2025-12-06 08:49:51.368	2025-11-29 08:49:51.37
\.


--
-- TOC entry 5103 (class 0 OID 16913)
-- Dependencies: 232
-- Data for Name: spaylater_customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spaylater_customers (id, user_id, credit_limit, available_credit, used_credit, total_paid, total_overdue, is_active, kyc_status, bank_account, bank_name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5107 (class 0 OID 16965)
-- Dependencies: 236
-- Data for Name: spaylater_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spaylater_payments (id, transaction_id, customer_id, amount, payment_method, payment_date, status, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 5105 (class 0 OID 16941)
-- Dependencies: 234
-- Data for Name: spaylater_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spaylater_transactions (id, customer_id, order_id, amount, paid_amount, purchase_date, due_date, status, late_fee, metadata, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5091 (class 0 OID 16794)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, phone, password_hash, user_type, is_verified, created_at, updated_at) FROM stdin;
2	thao nhi	thaonhi@gmail.com	0348990415	$2b$10$Xlp4NiNdM4EteYocITFbluDgz2uLfvFfSCliI5BJYN7LiqPyPPwsy	seller	f	2025-11-09 02:32:16.25	2025-11-09 02:34:11.016
4	Nguyen Phi Quan	phiquan@gmail.com	0904780711	$2b$10$QSPnIJKGlT75XoFcSqjeMO5R3WknQzrKrr1bWScaKKzvQrLm1UlfS	customer	f	2025-11-22 16:23:51.697	2025-11-22 16:23:51.697
9	Nguyễn Phi Quân	phiquan0947@gmail.com	0904780711	$2b$10$EFmeqmDYkVMQZ7XhlGnvAeDlYPR/pD3KPLKdg7cmq/8l.xdSpwd12	seller	t	2025-11-25 13:42:00.644	2025-11-25 13:42:00.644
10	Nguyễn Phi Quân	phiquan0@gmail.com	088716522	$2b$10$CuuObtaZ3zxx69.ubP.F2OENFWVlEeihIvYesD2HC7gIVSwAyClIm	customer	t	2025-11-25 13:43:30.704	2025-11-25 13:43:30.704
11	Phi Quan	npq@gmail.com	01546645	$2b$10$yu37BQ2sigK1a7VrtCnck.iI4nDWWJbZ81Fid8swXsumexO78hLtO	customer	t	2025-11-25 13:45:59.974	2025-11-25 13:45:59.974
13	admin	admin@gmail.com	012345675	$2b$10$OCfYUZonx3KWZjgFzTzAF.KgCuamtfmbq3YdwqfOae6vI9TLA/t9i	admin	f	2025-11-25 21:28:27.77	2025-11-27 23:05:42.212
1	nhi	nhi@gmail.com	012345678	$2b$10$Pml2WFZJc2RfkeQxp2M4lOuvgiVjt8BTZlJqxAtYwCY44B8ZXJyIe	seller	f	2025-11-08 09:21:58.505	2025-11-29 16:44:40.096
14	Nguyễn Phi Quân	phiquan04@gmail.com	0904780711	$2b$10$DqIRusBO3gRrffkXppPBde6QCwnYVOuru5UxjPb9XXweHtrufXRDW	admin	f	2025-11-25 22:29:15.48	2025-11-25 23:25:01.577
12	System Administrator	admin@ecomira.com	0987654321	$2b$10$TKoYiJ3z.9wIXDZiCMwoUecOrwfz/Qv6.7Jo44OIvdPs3dzunw/9O	admin	f	2025-11-25 15:51:06.877	2025-11-25 23:32:26.771
16	Nguyễn Phi Quân	phiquan097@gmail.com	0904780711	$2b$10$inHY9GVcR1b7ayVb9Ir3M.pbhVDNrI2NjLZaQRRU/2WbraV6l9iXm	seller	f	2025-11-25 23:33:00.393	2025-11-25 23:33:00.393
15	Nguyễn Phi Quân	phiquan09@gmail.com	0904780711	$2b$10$hDGABzsFP0e4kQqnVCd.xOdhM1D.P1nP1Wff9NT/c/qtSE4Wyi.5i	admin	f	2025-11-25 23:32:47.936	2025-11-26 12:45:44.991
18	Nguyen Van A	a@example.com	0123456781	hash1	customer	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
19	Le Thi B	b@example.com	0123456782	hash2	customer	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
20	Tran Van C	c@example.com	0123456783	hash3	seller	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
21	Hoang Thi D	d@example.com	0123456784	hash4	seller	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
22	Pham Van E	e@example.com	0123456785	hash5	seller	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
23	Do Thi F	f@example.com	0123456786	hash6	customer	f	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
24	Vu Van G	g@example.com	0123456787	hash7	customer	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
25	Mai Thi H	h@example.com	0123456788	hash8	seller	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
26	Bui Van I	i@example.com	0123456789	hash9	admin	t	2025-11-26 22:18:37.16	2025-11-26 22:18:37.16
\.


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 20, true);


--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 237
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 3, true);


--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 239
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 13, true);


--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 229
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 20, true);


--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 11, true);


--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 223
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 54, true);


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 221
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_id_seq', 32, true);


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 231
-- Name: spaylater_customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spaylater_customers_id_seq', 1, false);


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 235
-- Name: spaylater_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spaylater_payments_id_seq', 1, false);


--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 233
-- Name: spaylater_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spaylater_transactions_id_seq', 1, false);


--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 27, true);


--
-- TOC entry 4887 (class 2606 OID 16866)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 17002)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 4922 (class 2606 OID 17022)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 16911)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 16892)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 16850)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 16826)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 16939)
-- Name: spaylater_customers spaylater_customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_customers
    ADD CONSTRAINT spaylater_customers_pkey PRIMARY KEY (id);


--
-- TOC entry 4912 (class 2606 OID 16983)
-- Name: spaylater_payments spaylater_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_payments
    ADD CONSTRAINT spaylater_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4907 (class 2606 OID 16963)
-- Name: spaylater_transactions spaylater_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_transactions
    ADD CONSTRAINT spaylater_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2606 OID 16811)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 1259 OID 17048)
-- Name: conversations_user1_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_user1_id_idx ON public.conversations USING btree (user1_id);


--
-- TOC entry 4917 (class 1259 OID 17050)
-- Name: conversations_user1_id_user2_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX conversations_user1_id_user2_id_key ON public.conversations USING btree (user1_id, user2_id);


--
-- TOC entry 4918 (class 1259 OID 17049)
-- Name: conversations_user2_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX conversations_user2_id_idx ON public.conversations USING btree (user2_id);


--
-- TOC entry 4919 (class 1259 OID 17051)
-- Name: messages_conversation_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_conversation_id_idx ON public.messages USING btree (conversation_id);


--
-- TOC entry 4920 (class 1259 OID 17054)
-- Name: messages_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_created_at_idx ON public.messages USING btree (created_at);


--
-- TOC entry 4923 (class 1259 OID 17053)
-- Name: messages_receiver_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_receiver_id_idx ON public.messages USING btree (receiver_id);


--
-- TOC entry 4924 (class 1259 OID 17052)
-- Name: messages_sender_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX messages_sender_id_idx ON public.messages USING btree (sender_id);


--
-- TOC entry 4894 (class 1259 OID 17036)
-- Name: order_items_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_items_order_id_idx ON public.order_items USING btree (order_id);


--
-- TOC entry 4897 (class 1259 OID 17037)
-- Name: order_items_product_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_items_product_id_idx ON public.order_items USING btree (product_id);


--
-- TOC entry 4898 (class 1259 OID 17038)
-- Name: order_items_seller_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX order_items_seller_id_idx ON public.order_items USING btree (seller_id);


--
-- TOC entry 4888 (class 1259 OID 17033)
-- Name: orders_customer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_customer_id_idx ON public.orders USING btree (customer_id);


--
-- TOC entry 4889 (class 1259 OID 17035)
-- Name: orders_order_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_order_number_idx ON public.orders USING btree (order_number);


--
-- TOC entry 4890 (class 1259 OID 17032)
-- Name: orders_order_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);


--
-- TOC entry 4893 (class 1259 OID 17034)
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- TOC entry 4881 (class 1259 OID 17029)
-- Name: products_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_id_idx ON public.products USING btree (category_id);


--
-- TOC entry 4882 (class 1259 OID 17031)
-- Name: products_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_is_active_idx ON public.products USING btree (is_active);


--
-- TOC entry 4885 (class 1259 OID 17030)
-- Name: products_seller_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_seller_id_idx ON public.products USING btree (seller_id);


--
-- TOC entry 4878 (class 1259 OID 17027)
-- Name: sessions_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_token_idx ON public.sessions USING btree (token);


--
-- TOC entry 4879 (class 1259 OID 17026)
-- Name: sessions_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);


--
-- TOC entry 4880 (class 1259 OID 17028)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);


--
-- TOC entry 4901 (class 1259 OID 17040)
-- Name: spaylater_customers_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_customers_user_id_idx ON public.spaylater_customers USING btree (user_id);


--
-- TOC entry 4902 (class 1259 OID 17039)
-- Name: spaylater_customers_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX spaylater_customers_user_id_key ON public.spaylater_customers USING btree (user_id);


--
-- TOC entry 4909 (class 1259 OID 17046)
-- Name: spaylater_payments_customer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_payments_customer_id_idx ON public.spaylater_payments USING btree (customer_id);


--
-- TOC entry 4910 (class 1259 OID 17047)
-- Name: spaylater_payments_payment_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_payments_payment_date_idx ON public.spaylater_payments USING btree (payment_date);


--
-- TOC entry 4913 (class 1259 OID 17045)
-- Name: spaylater_payments_transaction_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_payments_transaction_id_idx ON public.spaylater_payments USING btree (transaction_id);


--
-- TOC entry 4903 (class 1259 OID 17041)
-- Name: spaylater_transactions_customer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_transactions_customer_id_idx ON public.spaylater_transactions USING btree (customer_id);


--
-- TOC entry 4904 (class 1259 OID 17044)
-- Name: spaylater_transactions_due_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_transactions_due_date_idx ON public.spaylater_transactions USING btree (due_date);


--
-- TOC entry 4905 (class 1259 OID 17042)
-- Name: spaylater_transactions_order_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_transactions_order_id_idx ON public.spaylater_transactions USING btree (order_id);


--
-- TOC entry 4908 (class 1259 OID 17043)
-- Name: spaylater_transactions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX spaylater_transactions_status_idx ON public.spaylater_transactions USING btree (status);


--
-- TOC entry 4871 (class 1259 OID 17024)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 4872 (class 1259 OID 17023)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4875 (class 1259 OID 17025)
-- Name: users_user_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_user_type_idx ON public.users USING btree (user_type);


--
-- TOC entry 4937 (class 2606 OID 17115)
-- Name: conversations conversations_user1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4938 (class 2606 OID 17120)
-- Name: conversations conversations_user2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4939 (class 2606 OID 17125)
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 17140)
-- Name: messages messages_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4941 (class 2606 OID 17135)
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4942 (class 2606 OID 17130)
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4929 (class 2606 OID 17075)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4930 (class 2606 OID 17080)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4931 (class 2606 OID 17085)
-- Name: order_items order_items_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4928 (class 2606 OID 17070)
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4926 (class 2606 OID 17060)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4927 (class 2606 OID 17065)
-- Name: products products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4925 (class 2606 OID 17055)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4932 (class 2606 OID 17090)
-- Name: spaylater_customers spaylater_customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_customers
    ADD CONSTRAINT spaylater_customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4935 (class 2606 OID 17105)
-- Name: spaylater_payments spaylater_payments_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_payments
    ADD CONSTRAINT spaylater_payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.spaylater_customers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4936 (class 2606 OID 17110)
-- Name: spaylater_payments spaylater_payments_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_payments
    ADD CONSTRAINT spaylater_payments_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.spaylater_transactions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4933 (class 2606 OID 17095)
-- Name: spaylater_transactions spaylater_transactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_transactions
    ADD CONSTRAINT spaylater_transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.spaylater_customers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4934 (class 2606 OID 17100)
-- Name: spaylater_transactions spaylater_transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spaylater_transactions
    ADD CONSTRAINT spaylater_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-11-29 16:56:07

--
-- PostgreSQL database dump complete
--

\unrestrict HXhAGlLrDxOPz4MRcFKrb5zOOF9UPfyxcG4e40eT3q1qH32IC8voO49ieOeizlB

