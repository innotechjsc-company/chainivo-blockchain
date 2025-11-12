"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BenefitsDigiService } from "@/api/services";
import { DigitizationRequestModal } from "./components";

const nftCategories = [
  {
    title: "Số hoá NFT",
    description:
      "Định dạng NFT cơ bản đại diện cho tài sản hoặc nội dung độc bản với chi phí triển khai tối ưu.",
  },
  {
    title: "Số hoá NFT đầu tư",
    description:
      "Cấu trúc cấp bậc rõ ràng, phù hợp cho chương trình hội viên, hệ thống nhiệm vụ và phần thưởng dựa trên thứ hạng.",
  },
];

const digitizingProcess = [
  {
    step: "1",
    title: "Tiếp nhận hồ sơ",
    description:
      "Thu thập thông tin tài sản, xác minh nguồn gốc và giấy tờ pháp lý.",
  },
  {
    step: "2",
    title: "Thẩm định giá trị",
    description:
      "Đánh giá tài sản và xác định các chỉ số kỹ thuật để phục vụ số hóa.",
  },
  {
    step: "3",
    title: "Lập bản sao on-chain",
    description:
      "Khởi tạo smart contract với các ràng buộc pháp lý và điều khoản sử dụng.",
  },
  {
    step: "4",
    title: "Bàn giao và quản lý",
    description:
      "Bàn giao NFT cho chủ sở hữu, kích hoạt hệ thống theo dõi và bảo mật.",
  },
];

const FALLBACK_IMAGE = "/nft-box.jpg";

const heroStats = [
  { label: "Tài sản đã số hóa", value: "3.2K+" },
  { label: "Giá trị khởi tạo", value: "$18M" },
  { label: "Thời gian trung bình", value: "72 giờ" },
];

const quickMetrics = [
  { label: "Tỷ lệ chấp thuận hồ sơ", value: "94%" },
  { label: "Smart contract đang kích hoạt", value: "860+" },
  { label: "Đối tác doanh nghiệp", value: "120+" },
];

export const DigitizingNftScreen = () => {
  const [benefits, setBenefits] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBenefits = async () => {
      const response = await BenefitsDigiService.getBenefits();

      if (response.success) {
        setBenefits((response.data as any)?.data);
      }
    };

    // Gọi API khi mount để luôn hiển thị dữ liệu mới nhất
    fetchBenefits();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-16">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center "
              style={{
                backgroundImage: "url('/staking-coin-hero.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/70" />
            <div className="absolute inset-0 bg-black/55" />
          </div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center text-white">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-primary">
                Chương trình số hóa tài sản Chainivo
              </span>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                <span className="gradient-text">
                  Biến tài sản của bạn thành NFT an toàn và minh bạch
                </span>
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                Từ thời điểm hồ sơ được tiếp nhận đến khi smart contract chính
                thức chạy trên Polygon Amoy, Chainivo đồng hành cùng bạn với quy
                trình tiêu chuẩn và cơ chế quản trị rủi ro chặt chẽ.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-white/90"
                >
                  Đăng ký số hóa ngay
                </button>
                <Link
                  href="/about"
                  className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Nhận tư vấn chuyên sâu
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex min-w-[160px] flex-col gap-1 rounded-2xl bg-white/10 px-6 py-5 text-center shadow-lg backdrop-blur transition hover:bg-white/20"
                  >
                    <span className="text-3xl font-semibold text-white">
                      {stat.value}
                    </span>
                    <span className="text-sm text-white/80">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pt-16 bg-background text-foreground">
          <div className="container mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center md:text-left">
            <h2 className="text-3xl font-bold gradient-text">
              Số hóa NFT là gì?
            </h2>
            <p className="text-base text-muted-foreground">
              Số hóa NFT là quá trình biến đổi tài sản vật lý hoặc tài sản số
              thành mã thống nhất trên blockchain. Mỗi NFT mang thông tin định
              danh duy nhất, đảm bảo tính minh bạch, khả năng giao dịch toàn cầu
              và tương tác thông minh nhằm quản lý quyền lợi của chủ sở hữu.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-background to-primary/5 text-foreground">
          <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h2 className="text-3xl font-bold gradient-text">
                Các hình thức số hoá
              </h2>
              <p className="text-base text-muted-foreground">
                Nền tảng Chainivo hỗ trợ đa dạng loại hình NFT, phù hợp với từng
                nhu cầu sở hữu và kinh doanh tài sản của bạn.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {nftCategories.map((category) => (
                <div
                  key={category.title}
                  className="flex h-full flex-col gap-3 rounded-2xl bg-white/10 p-6 text-white shadow-lg transition hover:bg-white/20"
                >
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-sm text-white/90">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-background text-foreground">
          <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h2 className="text-3xl font-bold gradient-text">
                Quy trình số hóa NFT
              </h2>
              <p className="text-base text-muted-foreground">
                Quy trình 4 bước được tối ưu để đảm bảo tài sản được đánh giá
                đúng, pháp lý minh bạch và smart contract chạy ổn định.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {digitizingProcess.map((step) => (
                <div
                  key={step.title}
                  className="relative flex h-full flex-col gap-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-sky-500/20 p-6 shadow-lg backdrop-blur"
                >
                  <span className="absolute -top-3 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-lg">
                    {step.step}
                  </span>
                  <h3 className="pt-6 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/90">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-background to-secondary/5 text-foreground">
          <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h2 className="text-3xl font-bold gradient-text">
                Quyền và lợi ích khi số hóa
              </h2>
              <p className="text-base text-muted-foreground">
                Chủ sở hữu nhận được hệ thống quyền lợi và công cụ quản trị tài
                sản toàn diện trên nền tảng Chainivo.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id ?? `${benefit.title}-${index}`}
                  className="flex h-full flex-col gap-3 rounded-2xl bg-white/10 p-6 text-white shadow-lg transition hover:bg-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white/10">
                      <Image
                        src={benefit.image.url || ""}
                        alt={benefit.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  </div>
                  <p className="text-sm text-white/90">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-background text-foreground">
          <div className="container mx-auto flex max-w-5xl flex-col gap-8 px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-3 text-center md:text-left">
                <h2 className="text-3xl font-bold gradient-text">
                  Khởi động số hóa NFT của bạn ngay hôm nay
                </h2>
                <p className="text-base text-muted-foreground">
                  Điền hồ sơ trực tuyến, chúng tôi hỗ trợ chi tiết từ bước thẩm
                  định đến lúc bàn giao NFT hoàn chỉnh.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3 text-sm font-semibold text-white shadow transition hover:opacity-90"
              >
                Thực hiện số hóa NFT ngay
              </button>
            </div>
            <div className="grid gap-6 pb-10 md:grid-cols-3">
              {quickMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col gap-2 rounded-2xl bg-white/10 p-6 text-center text-white shadow-lg backdrop-blur transition hover:bg-white/20"
                >
                  <span className="text-2xl font-semibold">{metric.value}</span>
                  <span className="text-sm text-white/80">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <DigitizationRequestModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          // Có thể thêm logic refresh data hoặc thông báo thành công
        }}
      />
    </div>
  );
};
