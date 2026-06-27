import {
  Brain,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: HeartPulse,
    title: "تحليل الأعراض",
    description:
      "أخبرني بأعراضك وسأساعدك على فهمها بشكل أفضل وإرشادك للخطوات التالية.",
  },
  {
    icon: Brain,
    title: "معلومات طبية موثوقة",
    description:
      "احصل على إجابات واضحة حول الأمراض والأدوية والإجراءات الطبية بلغة بسيطة.",
  },
  {
    icon: Stethoscope,
    title: "متابعة الحالة الصحية",
    description:
      "تابع حالتك الصحية عبر محادثات منظمة وسجّل ملاحظاتك اليومية.",
  },
  {
    icon: ShieldCheck,
    title: "نصائح وقائية",
    description:
      "تعرّف على أفضل الممارسات للحفاظ على صحتك وتجنّب الأمراض الشائعة.",
  },
  {
    icon: Zap,
    title: "ردود فورية",
    description:
      "احصل على إجابات لأسئلتك الصحية في ثوانٍ دون الحاجة للانتظار.",
  },
  {
    icon: MessageCircle,
    title: "محادثة طبيعية",
    description:
      "تحدّث مع المساعد كأنك تتحدث مع طبيب صديق — بالعربية وبأسلوب مريح.",
  },
];


export default function DiscoverPage() {
  return (
    <div className="h-full ps-3.5 pb-3.5 overflow-y-auto">
      <div className="min-h-full bg-[#3F424A] rounded-xl px-8 py-10 text-right">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-3">
            اكتشف مساعدك الصحي الذكي
          </h1>
          <p className="text-neutral-300 max-w-xl mx-auto text-sm leading-relaxed">
            مساعد طبي مدعوم بالذكاء الاصطناعي، يساعدك على فهم صحتك، الإجابة
            على أسئلتك، وإرشادك في رحلتك الصحية — كل ذلك بالعربية.
          </p>
        </div>

        {/* Features grid */}
        <h2 className="text-lg font-semibold text-teal-400 mb-4 text-right">
          ما الذي يمكنني مساعدتك به؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-zinc-800 rounded-xl p-5 flex flex-col gap-3 hover:bg-zinc-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-600/20 flex items-center justify-center">
                <Icon className="text-teal-400" size={20} />
              </div>
              <h3 className="text-white font-semibold text-sm">{title}</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300/80 text-xs leading-relaxed text-right">
            ⚠️ تنبيه: هذا المساعد يُقدّم معلومات صحية عامة وليس بديلاً عن
            استشارة طبيب مختص. في حالات الطوارئ يُرجى التواصل مع خدمات الطوارئ
            فوراً.
          </p>
        </div>
      </div>
    </div>
  );
}
